// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var Grid = require("grid");

var X = 6;
var Y = 5;
var gameBoard = [];

var statistics = {};

var addStatistics = function( length ) {
    if( statistics[ length ] ) {
        statistics[ length ] += 1;
    } else {
        statistics[ length ] = 1;
    }   
}

var getContinuous = function( list, field ) {
    var result = [];
    var tempResult = [];
    var prev;
    for( var i = 0; i < list.length; i++ ) {
        var item = list[ i ];
        if( prev == null ) {
            prev = item;
            tempResult.push( item );
        } else {
            if( item[ field ] - prev[ field ] == 1 ) {
                tempResult.push( item );
            } else {
                if( tempResult.length >= 3 ) {
                    result = result.concat( tempResult );
                    addStatistics( tempResult.length );
                }
                tempResult = [ item ];
            }
            prev = item;
        }
    }

    if( tempResult.length >= 3 ) {
        result = result.concat( tempResult );
        addStatistics( tempResult.length );				
    }

    return result;
}

var getContinuousGroup = function( list ) {
    var groupsX = {};
    var groupsY = {};

    var groupSkewX = {};
    var groupSkewY = {};

    for( var i = 0; i < list.length; i++ ) {
        var item = list[ i ];
        //横
        if( !groupsX[ item.i ] ) {
            groupsX[ item.i ] = [];
        }
        groupsX[ item.i ].push( item );
        //纵
        if( !groupsY[ item.j ] ) {
            groupsY[ item.j ] = [];
        }
        groupsY[ item.j ].push( item );			    
    }

    for( var i = 0; i < list.length; i++ ) {
        var item = list[ i ];
        //斜横
        var sum = item.i + item.j;
        if( !groupSkewX[ sum ] ) {
            groupSkewX[ sum ] = [];
        }
        groupSkewX[ sum ].push( item );
        
        //斜纵
        var difference = item.i - item.j;
        if( !groupSkewY[ difference ] ) {
            groupSkewY[ difference ] = [];
        }
        groupSkewY[ difference ].push( item );			    
    }

    var results = [];

    for( var key in groupsX ) {
        var array = groupsX[ key ];
        array.sort( function( a, b ) {
            return a.j - b.j;
        } );
        results = results.concat( getContinuous( array, 'j' ) );
    }

    for( var key in groupsY ) {
        var array = groupsY[ key ];
        array.sort( function( a, b ) {
            return a.i  - b.i;
        } );
        results = results.concat( getContinuous( array, 'i' ) );
    }

    for( var key in groupSkewX ) {
        var array = groupSkewX[ key ];
        array.sort( function( a, b ) {
            return a.i  - b.i;
        } );
        results = results.concat( getContinuous( array, 'i' ) );
    }

    for( var key in groupSkewY ) {
        var array = groupSkewY[ key ];
        array.sort( function( a, b ) {
            return a.i  - b.i;
        } );
        results = results.concat( getContinuous( array, 'i' ) );
    }

    return results;
}

var group = function( gameBoard ) {
    statistics = {};
    var groups = {};
    for( var i = 0; i < Y; i++ ) {
        for(  var j = 0; j < X; j++ ) {
            var grid = gameBoard[ i ][ j ];
            if( !groups[ grid.getNumber() ] ) {
                groups[ grid.getNumber() ] = [];
            }
            groups[ grid.getNumber() ].push( {
                grid:  grid,
                i: i, 
                j: j 
            } );
        }
    }			
    return groups;
}

function getYGrids( pos ) {	
    var grids = [];
    for( var i = 0; i < Y; i++ ) {
        grids.push( gameBoard[ i ][ pos.j ] );
    }
    return grids;
}

function getPos( gridID ) {
    for( var i = 0; i < Y; i++ ) {
        for( var j = 0; j < X; j++ ) {
            if( gameBoard[ i ][ j ].getID() == gridID ) {
                return {
                    i: i, j: j
                }
            }
        }
    }
}


var gridCount = 0;

function randomGrid() {
    var r = Math.floor( Math.random() * 10 );
    gridCount++;
    var g = new Grid();
    g.setNumber( r );
    g.setID( gridCount );
    return g; 	
}


cc.Class({
    getStatistics() {
        return statistics;
    },

    initBoard() {
        for( var i = 0; i < Y; i++ ) {
            gameBoard[ i ] =[];
            for(  var j = 0; j < X; j++ ) {
                gameBoard[ i ][ j ] = randomGrid();		
            }
        }
    },

    remove() {
        var groups = group( gameBoard );
        var gridMap = {};
        var grids = [];
        for( var key in groups ) {
            var list = getContinuousGroup( groups[ key ] );
            for( var i = 0; i < list.length; i++ ) {
                var item = list[ i ];
                var grid = item.grid; 
                grid.setTempState();
                grid.writeState();
                gridMap[ grid.getID() ] =  grid;
                gameBoard[ item.i ][ item.j ] = null;
            }
        }

        for( var key in gridMap ) {
            grids.push( gridMap[ key ] );
        }
        return grids;
    },

    testContinuable( board, pos, testPos ) {
        if( testPos.i < 0 || testPos.i > Y - 1 || testPos.j < 0 || testPos.j > X - 1 ) {
            return false;
        }
        var grid = board[ pos.i ][ pos.j ];
        var testGrid = board[ testPos.i ][ testPos.j ];

        board[ pos.i ][ pos.j ] = testGrid;
        board[ testPos.i ][ testPos.j ] = grid;

        var groups = group( board );
        for( var key in groups ) {
            var list = getContinuousGroup( groups[ key ] );
            if( list.length > 0 ) {
                board[ testPos.i ][ testPos.j ] = testGrid;
                board[ pos.i ][ pos.j ] = grid;
                return true;
            }
        }
        board[ testPos.i ][ testPos.j ] = testGrid;
        board[ pos.i ][ pos.j ] = grid;			
        return false;
    },

    continuable() {
        var posClone = [];
        for( var i = 0; i < Y; i++ ) {
            posClone[ i ] = [];
            for(  var j = 0; j < X; j++ ) {
               posClone[ i ][ j ] = gameBoard[ i ][ j ];
            }
        }				
        //log( posClone );

        for( var i = 0; i < Y; i++ ) {
            for(  var j = 0; j < X; j++ ) {
                var leftPos = { i: i, j: j - 1 };
                var rightPos = { i: i, j: j + 1 };
                var topPos = { i: i - 1, j: j };
                var bottomPos = { i: i + 1, j: j };
                if( this.testContinuable( posClone, { i: i, j: j }, leftPos ) ||
                         this.testContinuable( posClone, { i: i, j: j }, rightPos ) ||
                        this.testContinuable( posClone, { i: i, j: j }, topPos ) ||
                        this.testContinuable( posClone, { i: i, j: j }, bottomPos ) ) {
                    return true;
                } 
            }
        }					
        return false;
    },

    fillGameBoard : function() {
        for( var i = 0; i < Y; i++ ) {
            for( var j = 0; j < X; j++ ) {
                if( gameBoard[ i ][ j ] != null ) {
                    gameBoard[ i ][ j ].clearNew();
                    gameBoard[ i ][ j ].clearMoveCount();
                }
            }
        }	

        var pos =this.getFirstEmptyPos();
        var colMoveCount = {};
        while( pos ) {
            if( colMoveCount[ pos.j ] ) {
                colMoveCount[ pos.j ] ++ ;
            } else {
                colMoveCount[ pos.j ] = 1;
            }
            
            var index = pos.i;
            while( index < Y - 1 ) {
                var grid =  gameBoard[ index + 1 ][ pos.j ];
                grid.addMoveCount();
                gameBoard[ index ][ pos.j ] = grid;
                index++;
            }
            gameBoard[ Y - 1 ][ pos.j ] = randomGrid();
            gameBoard[ Y - 1 ][ pos.j ].setMoveCount( colMoveCount[ pos.j ] - 1 );

            pos = this.getFirstEmptyPos();
        }
    },

    getFirstEmptyPos() {
        for( let i = Y - 1; i >= 0; i-- ) {
            for( let j = X - 1; j >= 0; j-- ) {
                if( gameBoard[ i ][ j ] == null ) {
                    return { i: i, j: j };
                }
            }
        }	
    },

    getPos( gridID ) {
        return getPos( gridID );
    },

    swapGrid ( gridID1, gridID2 ) {
        var pos1 = getPos( gridID1 );
        var pos2 = getPos( gridID2 );
        if(pos1== null || pos2 == null) {
            console.log(pos1);
            console.log(pos2);
            console.log(gridID1);
            console.log(gridID2);
        }
        var grid1 = gameBoard[ pos1.i ][ pos1.j ];
        var grid2 = gameBoard[ pos2.i ][ pos2.j ];
        gameBoard[ pos1.i ][ pos1.j ] = grid2;
        gameBoard[ pos2.i ][ pos2.j ] = grid1;
    },

    getGameBoard() {
        return gameBoard;
    }
});

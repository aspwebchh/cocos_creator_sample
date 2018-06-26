

cc.Class({
    properties: {
        num : null,
        state : null,
        tempState : null,
        id: null,
        moveCount: 0,
        _isNew: true,
    },

    isNew() {
        return this._isNew;
    },

    clearNew() {
        this._isNew = false;
    },

    addMoveCount : function() {
        this.moveCount++;
    },

    getMoveCount : function() {
        return this.moveCount;
    },

    setMoveCount ( c ) {
        this.moveCount = c;
    },

    clearMoveCount() {
        this.moveCount = 0;
    },

    moveable() {
        return this.moveCount > 0 || this._isNew;
    },

    writeState() {
        this.tempState && ( this.state = this.tempState );
    },

    isRemoveable() {
        return this.state == 1;
    },

    setTempState() {
        this.tempState = 1;
    },

    restoreTempState() {
        this.tempState = 0;
    },
    
    setNumber( n ) { 
        this.num = n;
    },

    getNumber() {
        return this.num;
    },

    getID() {
        return this.id;
    },

    setID( id ) {
        this.id = id;
    }
});

import ItemWrapper from "./item_wrapper";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property
    game: any = null;

    private currItemWrapper : any;
    private currItemPosition : cc.Vec2;
    private isMousedown = false;
    private itemWrappers = [];
    private gridGame = null;

    onLoad() {
        this.gridGame = this.game.getGridGameStruct();
        this.gridGame.initBoard();
        let gameBoard = this.gridGame.getGameBoard();
        for(let row = 0; row < gameBoard.length; row++) {
            for(let col = 0; col < gameBoard[row] .length;col++) {
                let grid = gameBoard[row][col];
                grid.setMoveCount( gameBoard.length - 1 );

                let number = grid.getNumber();
                let node = this.createItem( number, grid.getID() );
                node.zIndex = 0;
                node.x = col * 100 - 300;
                node.y = row * 100 - 250;
                this.node.addChild(node);
            }
        }
    }

    private createItem(number : number, id: number) : cc.Node {
        let itemWrapper = this.game.createItem( number ) as ItemWrapper;
        itemWrapper.number = number;
        itemWrapper.id = id;
        this.itemWrappers.push(itemWrapper);
        let node = itemWrapper.content as cc.Node; 
        node.anchorX = 0;
        node.anchorY = 0;

        node.on(cc.Node.EventType.MOUSE_DOWN, e => {
            this.currItemWrapper = itemWrapper;
            this.currItemPosition = new cc.Vec2(node.x, node.y);
            this.isMousedown = true;
        }, this);

        node.on(cc.Node.EventType.MOUSE_MOVE, ( event: cc.Event.EventMouse ) => {
            if( !this.isMousedown ) {
                return;
            }
            var toPostion = this.node.convertToNodeSpaceAR(event.getLocation());
            let fromNode = this.currItemWrapper.content as cc.Node;
            fromNode.zIndex = 999;
            fromNode.x = toPostion.x - fromNode.width / 2;
            fromNode.y = toPostion.y - fromNode.height / 2;
        }, this);

        node.on(cc.Node.EventType.MOUSE_UP, ( event: cc.Event.EventMouse ) =>{
            this.isMousedown = false;
            let fromNode = this.currItemWrapper.content as cc.Node;
            var postion = this.node.convertToNodeSpaceAR(event.getLocation());
            let toNode = this.getTargetNode( event.target, postion );
            if( toNode == null ) {
                let fromNodeAct = cc.moveTo(0.1, this.currItemPosition);
                fromNode.runAction(fromNodeAct);
            } else {
                let fromNodeAct = cc.moveTo( 0.1, toNode.x, toNode.y );
                fromNode.runAction(fromNodeAct);
                fromNode.zIndex = 0;
                let toNodeAct = cc.moveTo(0.1, this.currItemPosition);
                toNode.runAction(toNodeAct);
                //执行逻辑交换
                let fromWrapper = this.findItemWrapperByItem( fromNode );
                let toWrapper = this.findItemWrapperByItem( toNode );
                let fromPos = this.gridGame.getPos( fromWrapper.id );
                let toPos = this.gridGame.getPos( toWrapper.id );
                this.gridGame.swapGrid(fromWrapper.id, toWrapper.id);
                var removeableGrids = this.gridGame.remove();	
                for(let i = 0; i < removeableGrids.length; i++) {
                    let id = removeableGrids[i].getID();
                    let removeableNode = this.findNodeById( id );
                    this.node.removeChild(removeableNode);
                }
                this.fill();
            }
        }, this)

        return node;
    }

    private fill() {
        this.gridGame.fillGameBoard();
        let gameBoard = this.gridGame.getGameBoard();
    
        for(let row = 0; row < gameBoard.length; row++) {
            for(let col = 0; col < gameBoard[row].length;col++) {
                let grid = gameBoard[row][col];
                if( grid.moveable() && !grid.isNew() ) {
                    let node = this.findNodeById(grid.getID());
                    if(node != null) {
                        node.y -= node.height * grid.getMoveCount();
                    }
                } else if( grid.isNew() ) {
                    let node = this.createItem(grid.getNumber(),grid.getID());
                    node.zIndex = 0;
                    node.x = col * 100 - 300;
                    node.y = row * 100 - 250;
                    this.node.addChild( node );
                }      
            }
        }
    }

    private getTargetNode(target: cc.Node, pos: cc.Vec2) : cc.Node {
        for(let i = 0; i < this.itemWrappers.length; i++) {
            let item = this.itemWrappers[i];
            let itemNode = item.content;
            let rect = new cc.Rect(itemNode.x,itemNode.y,itemNode.width,itemNode.height);
            if( rect.contains( pos ) && target != itemNode) {
                return itemNode;
            }
        }
        return null;
    }

    private findItemWrapperByItem( item ) {
        let resultItems = this.itemWrappers.filter( n => n.content == item );
        if( resultItems.length > 0 ) {
            return resultItems[0];
        } else {
            return null;
        }
    }

    private findNodeById( id ) : cc.Node{
        let resultItems = this.itemWrappers.filter( n =>n.id == id);
        if( resultItems.length > 0 ) {
            return resultItems[0].content;
        }  else {
            return null;
        }
    }

    start() {

    }

    // update (dt) {}
}

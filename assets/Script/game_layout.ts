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
    private targetItemWrapper : any;
    private isMousedown = false;
    private itemWrappers : any[] = [];

    onLoad() {
        // let itemWrapper = this.game.createItem();
        // this.node.addChild(this.game.createItem().content);
        // this.node.addChild(this.game.createItem().content);
        // this.node.addChild(this.game.createItem().content);
        // this.node.addChild(this.game.createItem().content);
        // this.node.addChild(this.game.createItem().content);
        // this.node.addChild(this.game.createItem().content);

        // this.node.addChild(this.game.createItem().content);
        // this.node.addChild(this.game.createItem().content);
        // this.node.addChild(this.game.createItem().content);
        // this.node.addChild(this.game.createItem().content);
        // this.node.addChild(this.game.createItem().content);
        // this.node.addChild(this.game.createItem().content);

        // this.node.addChild(this.createRow(0));
        // this.node.addChild(this.createRow(1));
        // this.node.addChild(this.createRow(2));
        // this.node.addChild(this.createRow(3));
        // this.node.addChild(this.createRow(4));
    }

    private findItemWrapperByItem( item ) {
        let resultItems = this.itemWrappers.filter( n => n.content == item );
        if( resultItems.length > 0 ) {
            return resultItems[0];
        } else {
            return null;
        }
    }

    private createRow( xIndex ) {
        let node = new cc.Node();
        let layout = node.addComponent(cc.Layout);
        layout.type = cc.Layout.Type.HORIZONTAL;
        layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        node.width = this.node.width;
        node.height = 100;
       
        for(let i = 0; i < 6;i++) {
            let itemWrapper = this.game.createItem();
            itemWrapper.xIndex = xIndex;
            itemWrapper.yIndex = i;
            this.itemWrappers.push(itemWrapper);

            let item = itemWrapper.content as cc.Node;
            node.addChild(item);
            
            item.on(cc.Node.EventType.MOUSE_DOWN, e => {
                this.currItemWrapper = itemWrapper;
                this.isMousedown = true;
            }, this);

            item.on(cc.Node.EventType.MOUSE_MOVE, ( event: cc.Event.EventMouse ) => {
                if( !this.isMousedown ) {
                    return;
                }
                let found = this.findItemWrapperByItem(event.target);
                if( found != null) {
                    this.targetItemWrapper = found;
                }
            }, this);

            item.on(cc.Node.EventType.MOUSE_UP, e =>{
                this.isMousedown = false;
            }, this)
        }

        return node;
    }



    start() {

    }

    // update (dt) {}
}

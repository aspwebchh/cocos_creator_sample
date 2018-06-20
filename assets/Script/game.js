// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        itemA: {
            default: null,
            type: cc.Prefab
        },
        itemB: {
            default: null,
            type: cc.Prefab
        },
        itemC: {
            default: null,
            type: cc.Prefab
        },
        itemD: {
            default: null,
            type: cc.Prefab
        },
        itemE: {
            default: null,
            type: cc.Prefab
        },
        itemF: {
            default: null,
            type: cc.Prefab
        },
        itemG: {
            default: null,
            type: cc.Prefab
        },
        itemH: {
            default: null,
            type: cc.Prefab
        },
        itemI: {
            default: null,
            type: cc.Prefab
        },
        itemJ: {
            default: null,
            type: cc.Prefab
        },
        layout:{
            default:null,
            type: cc.Layout
        }
    },


    createItem() {
        let prefabs = [this.itemA,this.itemB,this.itemC,this.itemD,this.itemE,this.itemF,this.itemG,this.itemH,this.itemI,this.itemJ];
        let random = Math.floor(Math.random() * prefabs.length);
        return cc.instantiate( prefabs[random] );
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.layout.getComponent('game_layout').game = this
    },

    start () {

    },

    // update (dt) {},
});

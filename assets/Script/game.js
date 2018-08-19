// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var ItemWrapper = require("./item_wrapper");
var GridGameStruct = require("./grid_game_struct");

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


    createItem( num ) {
        let prefabs = [this.itemA,this.itemB,this.itemC,this.itemD,this.itemE,this.itemF,this.itemG,this.itemH,this.itemI,this.itemJ];
        let item = cc.instantiate( prefabs[num] );
        let itemWrapper = new ItemWrapper.default();
        itemWrapper.content = item;
        return itemWrapper;
    },

    getGridGameStruct() {
        let gridGameStruct = new GridGameStruct();
        return gridGameStruct;
    },

    onLoad () {
        let gameLayout = this.layout.getComponent('game_layout');
        gameLayout.game = this;
    },
});

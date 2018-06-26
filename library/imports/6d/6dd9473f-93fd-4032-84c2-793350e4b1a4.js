"use strict";
cc._RF.push(module, '6dd94c/k/1AMoTCeTNQ5LGk', 'game_layout');
// Script/game_layout.ts

Object.defineProperty(exports, "__esModule", { value: true });
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.game = null;
        _this.isMousedown = false;
        _this.itemWrappers = [];
        _this.gridGame = null;
        return _this;
        // update (dt) {}
    }
    NewClass.prototype.onLoad = function () {
        this.gridGame = this.game.getGridGameStruct();
        this.gridGame.initBoard();
        var gameBoard = this.gridGame.getGameBoard();
        for (var row = 0; row < gameBoard.length; row++) {
            for (var col = 0; col < gameBoard[row].length; col++) {
                var grid = gameBoard[row][col];
                grid.setMoveCount(gameBoard.length - 1);
                var number = grid.getNumber();
                var node = this.createItem(number, grid.getID());
                node.zIndex = 0;
                node.x = col * 100 - 300;
                node.y = row * 100 - 250;
                this.node.addChild(node);
            }
        }
    };
    NewClass.prototype.createItem = function (number, id) {
        var _this = this;
        var itemWrapper = this.game.createItem(number);
        itemWrapper.number = number;
        itemWrapper.id = id;
        this.itemWrappers.push(itemWrapper);
        var node = itemWrapper.content;
        node.anchorX = 0;
        node.anchorY = 0;
        node.on(cc.Node.EventType.MOUSE_DOWN, function (e) {
            _this.currItemWrapper = itemWrapper;
            _this.currItemPosition = new cc.Vec2(node.x, node.y);
            _this.isMousedown = true;
        }, this);
        node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            if (!_this.isMousedown) {
                return;
            }
            var toPostion = _this.node.convertToNodeSpaceAR(event.getLocation());
            var fromNode = _this.currItemWrapper.content;
            fromNode.zIndex = 999;
            fromNode.x = toPostion.x - fromNode.width / 2;
            fromNode.y = toPostion.y - fromNode.height / 2;
        }, this);
        node.on(cc.Node.EventType.MOUSE_UP, function (event) {
            _this.isMousedown = false;
            var fromNode = _this.currItemWrapper.content;
            var postion = _this.node.convertToNodeSpaceAR(event.getLocation());
            var toNode = _this.getTargetNode(event.target, postion);
            if (toNode == null) {
                var fromNodeAct = cc.moveTo(0.1, _this.currItemPosition);
                fromNode.runAction(fromNodeAct);
            }
            else {
                var fromNodeAct = cc.moveTo(0.1, toNode.x, toNode.y);
                fromNode.runAction(fromNodeAct);
                fromNode.zIndex = 0;
                var toNodeAct = cc.moveTo(0.1, _this.currItemPosition);
                toNode.runAction(toNodeAct);
                //执行逻辑交换
                var fromWrapper = _this.findItemWrapperByItem(fromNode);
                var toWrapper = _this.findItemWrapperByItem(toNode);
                var fromPos = _this.gridGame.getPos(fromWrapper.id);
                var toPos = _this.gridGame.getPos(toWrapper.id);
                _this.gridGame.swapGrid(fromWrapper.id, toWrapper.id);
                var removeableGrids = _this.gridGame.remove();
                for (var i = 0; i < removeableGrids.length; i++) {
                    var id_1 = removeableGrids[i].getID();
                    var removeableNode = _this.findNodeById(id_1);
                    _this.node.removeChild(removeableNode);
                }
                _this.fill();
            }
        }, this);
        return node;
    };
    NewClass.prototype.fill = function () {
        this.gridGame.fillGameBoard();
        var gameBoard = this.gridGame.getGameBoard();
        for (var row = 0; row < gameBoard.length; row++) {
            for (var col = 0; col < gameBoard[row].length; col++) {
                var grid = gameBoard[row][col];
                if (grid.moveable() && !grid.isNew()) {
                    var node = this.findNodeById(grid.getID());
                    if (node != null) {
                        node.y -= node.height * grid.getMoveCount();
                    }
                }
                else if (grid.isNew()) {
                    var node = this.createItem(grid.getNumber(), grid.getID());
                    node.zIndex = 0;
                    node.x = col * 100 - 300;
                    node.y = row * 100 - 250;
                    this.node.addChild(node);
                }
            }
        }
    };
    NewClass.prototype.getTargetNode = function (target, pos) {
        for (var i = 0; i < this.itemWrappers.length; i++) {
            var item = this.itemWrappers[i];
            var itemNode = item.content;
            var rect = new cc.Rect(itemNode.x, itemNode.y, itemNode.width, itemNode.height);
            if (rect.contains(pos) && target != itemNode) {
                return itemNode;
            }
        }
        return null;
    };
    NewClass.prototype.findItemWrapperByItem = function (item) {
        var resultItems = this.itemWrappers.filter(function (n) { return n.content == item; });
        if (resultItems.length > 0) {
            return resultItems[0];
        }
        else {
            return null;
        }
    };
    NewClass.prototype.findNodeById = function (id) {
        var resultItems = this.itemWrappers.filter(function (n) { return n.id == id; });
        if (resultItems.length > 0) {
            return resultItems[0].content;
        }
        else {
            return null;
        }
    };
    NewClass.prototype.start = function () {
    };
    __decorate([
        property
    ], NewClass.prototype, "game", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();
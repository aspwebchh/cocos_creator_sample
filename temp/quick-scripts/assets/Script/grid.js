(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/grid.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2f06dbx8VFIJKZ35vUR1Yl+', 'grid', __filename);
// Script/grid.js

"use strict";

cc.Class({
    properties: {
        num: null,
        state: null,
        tempState: null,
        id: null,
        moveCount: 0,
        _isNew: true
    },

    isNew: function isNew() {
        return this._isNew;
    },
    clearNew: function clearNew() {
        this._isNew = false;
    },


    addMoveCount: function addMoveCount() {
        this.moveCount++;
    },

    getMoveCount: function getMoveCount() {
        return this.moveCount;
    },

    setMoveCount: function setMoveCount(c) {
        this.moveCount = c;
    },
    clearMoveCount: function clearMoveCount() {
        this.moveCount = 0;
    },
    moveable: function moveable() {
        return this.moveCount > 0 || this._isNew;
    },
    writeState: function writeState() {
        this.tempState && (this.state = this.tempState);
    },
    isRemoveable: function isRemoveable() {
        return this.state == 1;
    },
    setTempState: function setTempState() {
        this.tempState = 1;
    },
    restoreTempState: function restoreTempState() {
        this.tempState = 0;
    },
    setNumber: function setNumber(n) {
        this.num = n;
    },
    getNumber: function getNumber() {
        return this.num;
    },
    getID: function getID() {
        return this.id;
    },
    setID: function setID(id) {
        this.id = id;
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=grid.js.map
        
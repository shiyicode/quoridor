(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/model/vo/RoomVO.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd31e5kfDXlJpJd2aFOOEbna', 'RoomVO', __filename);
// script/model/vo/RoomVO.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RoomVO = /** @class */ (function () {
    function RoomVO() {
        this.playersInfo = [];
        for (var i = 0; i < 4; i++) {
            this.playersInfo.push(new PlayerVO());
        }
    }
    return RoomVO;
}());
exports.RoomVO = RoomVO;
var PlayerVO = /** @class */ (function () {
    function PlayerVO() {
    }
    return PlayerVO;
}());
exports.PlayerVO = PlayerVO;

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
        //# sourceMappingURL=RoomVO.js.map
        
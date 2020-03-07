"use strict";
cc._RF.push(module, 'd31e5kfDXlJpJd2aFOOEbna', 'RoomVO');
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
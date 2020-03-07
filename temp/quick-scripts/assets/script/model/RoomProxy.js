(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/model/RoomProxy.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ed6bdqJX9hAjYCHi7krJftG', 'RoomProxy', __filename);
// script/model/RoomProxy.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var RoomVO_1 = require("./vo/RoomVO");
var Constants_1 = require("../Constants");
var Util_1 = require("../util/Util");
var UserProxy_1 = require("./UserProxy");
// 只需要在使用 MGOBE 之前 import 一次该文件
require("../library/mgobe/MGOBE.js");
var MgobeService_1 = require("../services/mgobe/MgobeService");
// 直接使用 MGOBE
var Room = MGOBE.Room, Listener = MGOBE.Listener, ErrCode = MGOBE.ErrCode, ENUM = MGOBE.ENUM, DebuggerLog = MGOBE.DebuggerLog;
var RoomProxy = /** @class */ (function (_super) {
    __extends(RoomProxy, _super);
    function RoomProxy() {
        var _this = _super.call(this, RoomProxy.NAME) || this;
        _this.room = null;
        _this.room = new RoomVO_1.RoomVO();
        return _this;
    }
    RoomProxy.getInstance = function () {
        if (!this.instance) {
            this.instance = new RoomProxy();
        }
        return this.instance;
    };
    // 判断是否已在房间内
    RoomProxy.prototype.returnRoom = function () {
        var _this = this;
        MgobeService_1.default.getMyRoom(function (event) {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("玩家已在房间中", event);
                // 如果房间有进行中的游戏，才返回
                _this.setRoom(event.data.roomInfo);
                _this.listenRoom();
                _this.facade.sendNotification(Constants_1.RoomNotification.ROOM_RETURN_CHECK);
            }
            else {
                console.log("玩家不在房间中");
                _this.facade.sendNotification(Constants_1.RoomNotification.ROOM_RETURN_NOT_CHECK);
            }
        });
    };
    RoomProxy.prototype.joinRoom = function (roomId) {
        var _this = this;
        console.log("加入房间");
        var userProxy = this.facade.retrieveProxy(UserProxy_1.default.NAME);
        var userInfo = userProxy.getUserInfo();
        var player = new RoomVO_1.PlayerVO();
        player.avatarUrl = userInfo.avatarUrl;
        player.nickName = userInfo.nickName;
        player.isReady = false;
        MgobeService_1.default.joinRoom(roomId, player, function (event) {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("加入房间成功", event);
                _this.setRoom(event.data.roomInfo);
                _this.listenRoom();
                _this.facade.sendNotification(Constants_1.RoomNotification.ROOM_JOIN_SUCC);
            }
            else {
                console.log("加入房间失败", event);
                _this.facade.sendNotification(Constants_1.RoomNotification.ROOM_JOIN_FAIL);
            }
        });
    };
    RoomProxy.prototype.createRoom = function (gameType) {
        var _this = this;
        console.log("创建房间");
        var userProxy = this.facade.retrieveProxy(UserProxy_1.default.NAME);
        var userInfo = userProxy.getUserInfo();
        var player = new RoomVO_1.PlayerVO();
        player.avatarUrl = userInfo.avatarUrl;
        player.nickName = userInfo.nickName;
        player.isReady = false;
        MgobeService_1.default.createRoom(player, Util_1.default.getPlayerCntByType(gameType), gameType, function (event) {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("创建房间成功", event);
                _this.setRoom(event.data.roomInfo);
                _this.listenRoom();
                _this.facade.sendNotification(Constants_1.RoomNotification.ROOM_CREATE_SUCC);
            }
            else {
                console.log("创建房间失败", event);
                _this.facade.sendNotification(Constants_1.RoomNotification.ROOM_CREATE_FAIL);
            }
        });
    };
    // TODO 断线时不应该离开房间，  重回游戏时，如果在游戏中，应提示是否返回游戏
    RoomProxy.prototype.leaveRoom = function () {
        var _this = this;
        MgobeService_1.default.leaveRoom(function (event) {
            if (event.code === MGOBE.ErrCode.EC_OK || event.code === MGOBE.ErrCode.EC_ROOM_PLAYER_NOT_IN_ROOM) {
                _this.facade.sendNotification(Constants_1.RoomNotification.ROOM_LEAVE_SUCC);
            }
            else {
                _this.facade.sendNotification(Constants_1.RoomNotification.ROOM_LEAVE_FAIL);
            }
        });
    };
    RoomProxy.prototype.setReadyStatus = function (hasReady) {
        MgobeService_1.default.changeCustomPlayerStatus(hasReady ? 1 : 0, function (event) {
            if (event.code === MGOBE.ErrCode.EC_OK) {
            }
            else {
                console.log("弹窗，提醒用户重试");
            }
        });
    };
    RoomProxy.prototype.getRoom = function () {
        return this.room;
    };
    RoomProxy.prototype.setRoom = function (roomInfo) {
        var userProxy = this.facade.retrieveProxy(UserProxy_1.default.NAME);
        this.room.gameType = roomInfo.type;
        this.room.roomId = roomInfo.id;
        var meIdx = 0;
        var playerList = roomInfo.playerList;
        for (var i = 0; i < playerList.length; i++) {
            if (playerList[i].id == userProxy.getPlayerId()) {
                meIdx = i;
                break;
            }
        }
        for (var i = 0; i < playerList.length; i++) {
            var new_i = (i + meIdx) % playerList.length;
            this.room.playersInfo[i].playerID = playerList[new_i].id;
            this.room.playersInfo[i].avatarUrl = playerList[new_i].customProfile;
            this.room.playersInfo[i].nickName = playerList[new_i].name;
            this.room.playersInfo[i].isReady = playerList[new_i].customPlayerStatus == 1;
        }
    };
    RoomProxy.prototype.listenRoom = function () {
        var _this = this;
        console.log("启动room监听");
        // 开启onUpdate监听
        MgobeService_1.default.room.onUpdate = function (event) {
            console.log("事件回调onUpdate", event.roomInfo);
            _this.setRoom(event.roomInfo);
            if (!event.roomInfo.playerList.find(function (player) { return player.customPlayerStatus !== 1; })) {
                // TODO 全部玩家准备好就跳转Game
            }
            _this.facade.sendNotification(Constants_1.RoomNotification.ROOM_UPDATE);
        };
        MgobeService_1.default.room.onJoinRoom = function (event) {
        };
        MgobeService_1.default.room.onLeaveRoom = function (event) {
        };
    };
    RoomProxy.prototype.removeListenRoom = function () {
        console.log("关闭room监听");
        // 关闭onUpdate监听
        MgobeService_1.default.room.onUpdate = null;
    };
    RoomProxy.NAME = "RoomProxy";
    RoomProxy.instance = null;
    return RoomProxy;
}(puremvc.Proxy));
exports.default = RoomProxy;

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
        //# sourceMappingURL=RoomProxy.js.map
        
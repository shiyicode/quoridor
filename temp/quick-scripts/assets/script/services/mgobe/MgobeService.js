(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/services/mgobe/MgobeService.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1e661LPs0JJcZmGTTesr646', 'MgobeService', __filename);
// script/services/mgobe/MgobeService.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("../../Constants");
require("../../library/mgobe/MGOBE.js");
var MgobeService = /** @class */ (function () {
    function MgobeService() {
    }
    MgobeService.getMyRoom = function (callback) {
        var _this = this;
        MGOBE.Room.getMyRoom(function (event) {
            console.log("获取当前房间信息", event);
            if (event.code === MGOBE.ErrCode.EC_OK) {
                _this.room.roomInfo = event.data.roomInfo;
            }
            callback && callback(event);
        });
    };
    MgobeService.initRoom = function (roomId, callback) {
        // const roomInfo = { id: roomId };
        // this.room.initRoom(roomInfo);
        var getRoomByRoomIdPara2 = {
            roomId: roomId,
        };
        MGOBE.Room.getRoomByRoomId(getRoomByRoomIdPara2, function (event) {
            callback && callback(event);
        });
    };
    MgobeService.joinRoom = function (roomId, player, callback) {
        var _this = this;
        this.initRoom(roomId, function (event) {
            console.log("获取房间信息", roomId, event);
            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("获取房间信息, 更新成功", roomId);
                _this.room.initRoom(event.data.roomInfo);
            }
            var playerInfo = {
                name: player.nickName,
                customPlayerStatus: player.isReady ? 1 : 0,
                customProfile: player.avatarUrl,
            };
            var joinRoomPara = {
                playerInfo: playerInfo,
            };
            _this.room.joinRoom(joinRoomPara, function (event) {
                callback && callback(event);
            });
        });
    };
    MgobeService.createRoom = function (player, maxPlayers, roomType, callback) {
        var playerInfo = {
            name: player.nickName,
            customPlayerStatus: player.isReady ? 1 : 0,
            customProfile: player.avatarUrl,
        };
        var createRoomPara = {
            roomName: "房间名",
            maxPlayers: maxPlayers,
            roomType: roomType,
            isPrivate: false,
            customProperties: "WAIT",
            playerInfo: playerInfo,
        };
        this.room.createRoom(createRoomPara, function (event) {
            callback && callback(event);
        });
    };
    MgobeService.leaveRoom = function (callback) {
        this.room.leaveRoom({}, function (event) {
            callback && callback(event);
        });
    };
    MgobeService.changeCustomPlayerStatus = function (customPlayerStatus, callback) {
        var changeCustomPlayerStatusPara = {
            customPlayerStatus: customPlayerStatus
        };
        this.room.changeCustomPlayerStatus(changeCustomPlayerStatusPara, function (event) {
            callback && callback(event);
        });
    };
    MgobeService.isInited = function () {
        // 初始化成功后才有玩家ID
        return !!MGOBE.Player && !!MGOBE.Player.id;
    };
    MgobeService.initMgobeSDK = function (openId, gameId, secretKey, url, cacertNativeUrl, callback) {
        var _this = this;
        // 如果已经初始化，直接回调成功
        if (this.isInited()) {
            return callback && callback({ code: MGOBE.ErrCode.EC_OK });
        }
        var gameInfo = {
            gameId: gameId,
            secretKey: secretKey,
            openId: openId,
        };
        var config = {
            url: url,
            reconnectInterval: Constants_1.Config.reconnectInterval,
            reconnectMaxTimes: Constants_1.Config.reconnectMaxTimes,
            resendInterval: Constants_1.Config.resendInterval,
            resendTimeout: Constants_1.Config.resendTimeout,
            isAutoRequestFrame: true,
            cacertNativeUrl: cacertNativeUrl,
        };
        MGOBE.DebuggerLog.enable = Constants_1.Config.isDebug;
        // if (cc.sys.isNative) {
        //     MGOBE.DebuggerLog.enable = false;
        // }
        // 初始化
        MGOBE.Listener.init(gameInfo, config, function (event) {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("初始化成功");
                // 初始化后才能添加监听
                _this.room = new MGOBE.Room();
                MGOBE.Listener.add(_this.room);
                // 设置默认广播
                _this.setBroadcastCallbacks(null, {});
            }
            else {
                console.log("初始化失败", event.code);
            }
            callback && callback({ code: event.code });
        });
    };
    // TODO 将callback注册放到这里 将room
    MgobeService.setCallbacks = function () {
    };
    /**
     * 设置房间广播回调函数
     * @param broadcastCallbacks
     */
    MgobeService.setBroadcastCallbacks = function (context, broadcastCallbacks) {
        var _this = this;
        if (!this.room) {
            return;
        }
        // 默认回调函数
        var generateDefaultCallback = function (tag) { return function (event) { console.log(tag, "->", event); }; };
        var defaultCallbacks = {
            onUpdate: function () { return generateDefaultCallback("onUpdate"); },
            onJoinRoom: function () { return generateDefaultCallback("onJoinRoom"); },
            onLeaveRoom: function () { return generateDefaultCallback("onLeaveRoom"); },
            onChangeRoom: function () { return generateDefaultCallback("onChangeRoom"); },
            onDismissRoom: function () { return generateDefaultCallback("onDismissRoom"); },
            onStartFrameSync: function () { return generateDefaultCallback("onStartFrameSync"); },
            onStopFrameSync: function () { return generateDefaultCallback("onStopFrameSync"); },
            onRecvFrame: function (event) {
                generateDefaultCallback("onRecvFrame");
                // 每次收到帧广播都需要计算
                // calcFrame(event.data.frame);
            },
            onChangeCustomPlayerStatus: function () { return generateDefaultCallback("onChangeCustomPlayerStatus"); },
            onRemovePlayer: function () { return generateDefaultCallback("onRemovePlayer"); },
            onRecvFromClient: function () { return generateDefaultCallback("onRecvFromClient"); },
            onRecvFromGameSvr: function () { return generateDefaultCallback("onRecvFromGameSvr"); },
            onAutoRequestFrameError: function () { return generateDefaultCallback("onAutoRequestFrameError"); },
        };
        // 给 room 实例设置广播回调函数
        Object.keys(defaultCallbacks).forEach(function (key) {
            var callback = broadcastCallbacks[key] ? broadcastCallbacks[key].bind(context) : defaultCallbacks[key];
            _this.room[key] = callback;
        });
    };
    // 将room置为私有 private
    MgobeService.room = null;
    return MgobeService;
}());
exports.default = MgobeService;

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
        //# sourceMappingURL=MgobeService.js.map
        
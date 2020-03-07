(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/Constants.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'da307vdKUpNKaGAi0Er7i68', 'Constants', __filename);
// script/Constants.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WorldNotification;
(function (WorldNotification) {
    WorldNotification["SHOW_LOADING"] = "SHOW_LOADING";
    WorldNotification["HIDE_LOADING"] = "HIDE_LOADING";
    WorldNotification["SHOW_TIPS"] = "SHOW_TIPS";
})(WorldNotification = exports.WorldNotification || (exports.WorldNotification = {}));
var UserNotification;
(function (UserNotification) {
    UserNotification["AUTHORIZE"] = "AUTHORIZE";
    UserNotification["AUTHORIZE_SUCC"] = "AUTHORIZE_SUCC";
    UserNotification["AUTHORIZE_FAIL"] = "AUTHORIZE_FAIL";
})(UserNotification = exports.UserNotification || (exports.UserNotification = {}));
// TODO 很多FAIL可以考虑用SHOW_TIPS代替
var RoomNotification;
(function (RoomNotification) {
    RoomNotification["ROOM_CREATE_SUCC"] = "ROOM_CREATE_SUCC";
    RoomNotification["ROOM_CREATE_FAIL"] = "ROOM_CREATE_FAIL";
    RoomNotification["ROOM_JOIN_SUCC"] = "ROOM_JOIN_SUCC";
    RoomNotification["ROOM_JOIN_FAIL"] = "ROOM_JOIN_FAIL";
    RoomNotification["ROOM_LEAVE_SUCC"] = "ROOM_LEAVE_SUCC";
    RoomNotification["ROOM_LEAVE_FAIL"] = "ROOM_LEAVE_FAIL";
    RoomNotification["ROOM_RETURN_CHECK"] = "ROOM_RETURN_CHECK";
    RoomNotification["ROOM_RETURN_NOT_CHECK"] = "ROOM_RETURN_NOT_CHECK";
    RoomNotification["ROOM_RETURN_AGREE"] = "ROOM_RETURN_AGREE";
    RoomNotification["ROOM_RETURN_DISAGREE"] = "ROOM_RETURN_DISAGREE";
    RoomNotification["ROOM_UPDATE"] = "ROOM_UPDATE";
})(RoomNotification = exports.RoomNotification || (exports.RoomNotification = {}));
var GameNotification;
(function (GameNotification) {
})(GameNotification = exports.GameNotification || (exports.GameNotification = {}));
var GameType;
(function (GameType) {
    GameType["TEAM2"] = "team2";
    GameType["MATCH2"] = "match2";
    GameType["MACHINE2"] = "machine2";
    GameType["TEAM4"] = "team4";
    GameType["MATCH4"] = "match4";
    GameType["MACHINE4"] = "machine4";
})(GameType = exports.GameType || (exports.GameType = {}));
var Scene;
(function (Scene) {
    Scene["WELCOME"] = "welcome";
    Scene["MENU"] = "menu";
    Scene["ROOM"] = "room";
    Scene["GAME"] = "game";
})(Scene = exports.Scene || (exports.Scene = {}));
exports.Config = {
    WXCloudEnvID: "dev-620e72",
    MGOBEGameId: "obg-fqdy9jzs",
    MGOBESecretKey: 'edb151a57fbbbd59f1c81399d8a5773aa40aee21',
    MGOBEHost: 'fqdy9jzs.wxlagame.com',
    reconnectMaxTimes: 5,
    reconnectInterval: 1000,
    resendInterval: 1000,
    resendTimeout: 10000,
    isDebug: false,
};

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
        //# sourceMappingURL=Constants.js.map
        
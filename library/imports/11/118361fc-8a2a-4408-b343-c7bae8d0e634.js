"use strict";
cc._RF.push(module, '11836H8iipECLNDx7ro0OY0', 'MenuViewMediator');
// script/view/MenuViewMediator.ts

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
var Constants_1 = require("../Constants");
var UserProxy_1 = require("../model/UserProxy");
var RoomProxy_1 = require("../model/RoomProxy");
var MenuViewMediator = /** @class */ (function (_super) {
    __extends(MenuViewMediator, _super);
    function MenuViewMediator(viewComponent) {
        return _super.call(this, MenuViewMediator.NAME, viewComponent) || this;
    }
    MenuViewMediator.prototype.listNotificationInterests = function () {
        return [
            Constants_1.RoomNotification.ROOM_CREATE_SUCC,
            Constants_1.RoomNotification.ROOM_CREATE_FAIL,
            Constants_1.RoomNotification.ROOM_JOIN_SUCC,
            Constants_1.RoomNotification.ROOM_JOIN_FAIL,
            Constants_1.RoomNotification.ROOM_RETURN_CHECK,
            Constants_1.RoomNotification.ROOM_RETURN_NOT_CHECK,
        ];
    };
    MenuViewMediator.prototype.handleNotification = function (notification) {
        var data = notification.getBody();
        switch (notification.getName()) {
            case Constants_1.RoomNotification.ROOM_CREATE_SUCC:
                cc.director.loadScene(Constants_1.Scene.ROOM);
                break;
            case Constants_1.RoomNotification.ROOM_CREATE_FAIL:
                break;
            case Constants_1.RoomNotification.ROOM_JOIN_SUCC:
                cc.director.loadScene(Constants_1.Scene.ROOM);
                break;
            case Constants_1.RoomNotification.ROOM_JOIN_FAIL:
                break;
            case Constants_1.RoomNotification.ROOM_RETURN_CHECK: {
                // TODO 对已在房间的玩家弹选择框
                console.log("room return check");
                cc.director.loadScene(Constants_1.Scene.ROOM);
                break;
            }
            case Constants_1.RoomNotification.ROOM_RETURN_NOT_CHECK: {
                this.actionByLaunchQuery();
                break;
            }
            case Constants_1.RoomNotification.ROOM_RETURN_AGREE: {
                break;
            }
            case Constants_1.RoomNotification.ROOM_RETURN_DISAGREE: {
                break;
            }
        }
    };
    MenuViewMediator.prototype.onRegister = function () {
        var roomProxy = this.facade.retrieveProxy(RoomProxy_1.default.NAME);
        this.initView();
        this.initCallback();
        roomProxy.returnRoom();
    };
    MenuViewMediator.prototype.onRemove = function () {
    };
    MenuViewMediator.prototype.initCallback = function () {
        var roomProxy = this.facade.retrieveProxy(RoomProxy_1.default.NAME);
        var userProxy = this.facade.retrieveProxy(UserProxy_1.default.NAME);
        var viewComponent = this.viewComponent;
        // 设置控件回调
        viewComponent.mode2ButtonClick = function (event, data) {
            console.log("mode2 button click");
            viewComponent.setModeType(4);
            userProxy.setModeType(4);
        };
        viewComponent.mode4ButtonClick = function (event, data) {
            console.log("mode4 button click");
            viewComponent.setModeType(2);
            userProxy.setModeType(2);
        };
        // TODO 后续多个游戏模式若耦合过多，可以整合为一个callback
        viewComponent.team2ButtonClick = function (event, data) {
            console.log("team2 button click");
            roomProxy.createRoom(Constants_1.GameType.TEAM2);
        };
        viewComponent.team4ButtonClick = function (event, data) {
            console.log("team4 button click");
            roomProxy.createRoom(Constants_1.GameType.TEAM4);
        };
        viewComponent.match2ButtonClick = function (event, data) {
            console.log("match2 button click");
            // this.facade.sendNotification(RoomNotification.ROOM_CREATE, { gameType: GameType.MATCH2 });
        };
    };
    MenuViewMediator.prototype.initView = function () {
        var viewComponent = this.viewComponent;
        var userProxy = this.facade.retrieveProxy(UserProxy_1.default.NAME);
        viewComponent.setModeType(userProxy.getModeType());
        var userInfo = userProxy.getUserInfo();
        viewComponent.setUserInfo(userInfo.avatarUrl, userInfo.nickName);
    };
    MenuViewMediator.prototype.actionByLaunchQuery = function () {
        var userProxy = this.facade.retrieveProxy(UserProxy_1.default.NAME);
        var launch = userProxy.getLaunch();
        userProxy.setLaunch({});
        console.log("loadByLaunchQuery", launch);
        if ((launch && launch.query && launch.scene) && (launch.scene == 1007 || launch.scene == 1008)) {
            switch (launch.query.type) {
                case Constants_1.GameType.TEAM2: {
                    var roomProxy = this.facade.retrieveProxy(RoomProxy_1.default.NAME);
                    roomProxy.joinRoom(launch.query.roomId);
                    break;
                }
                default: {
                }
            }
        }
    };
    MenuViewMediator.NAME = "MenuViewMediator";
    return MenuViewMediator;
}(puremvc.Mediator));
exports.default = MenuViewMediator;

cc._RF.pop();
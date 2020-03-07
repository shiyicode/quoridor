"use strict";
cc._RF.push(module, '3030aNz+05P3rUQGjqfUkle', 'RoomViewMediator');
// script/view/RoomViewMediator.ts

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
var RoomProxy_1 = require("../model/RoomProxy");
var IPlatform_1 = require("../services/platform/IPlatform");
var RoomViewMediator = /** @class */ (function (_super) {
    __extends(RoomViewMediator, _super);
    function RoomViewMediator(viewComponent) {
        return _super.call(this, RoomViewMediator.NAME, viewComponent) || this;
    }
    RoomViewMediator.prototype.listNotificationInterests = function () {
        return [
            Constants_1.RoomNotification.ROOM_UPDATE,
            Constants_1.RoomNotification.ROOM_LEAVE_SUCC,
            Constants_1.RoomNotification.ROOM_LEAVE_FAIL,
        ];
    };
    RoomViewMediator.prototype.handleNotification = function (notification) {
        var roomProxy = this.facade.retrieveProxy(RoomProxy_1.default.NAME);
        var viewComponent = this.viewComponent;
        var data = notification.getBody();
        switch (notification.getName()) {
            case Constants_1.RoomNotification.ROOM_UPDATE: {
                console.log("notify ====== room_update");
                var room = roomProxy.getRoom();
                viewComponent.updateRoom(room);
                break;
            }
            case Constants_1.RoomNotification.ROOM_LEAVE_SUCC: {
                cc.director.loadScene(Constants_1.Scene.MENU);
                break;
            }
            case Constants_1.RoomNotification.ROOM_LEAVE_FAIL: {
                break;
            }
        }
    };
    RoomViewMediator.prototype.onRegister = function () {
        var roomProxy = this.facade.retrieveProxy(RoomProxy_1.default.NAME);
        // 绑定监听必须放在首部
        roomProxy.listenRoom();
        this.initView();
        this.initCallback();
    };
    RoomViewMediator.prototype.onRemove = function () {
        var roomProxy = this.facade.retrieveProxy(RoomProxy_1.default.NAME);
        roomProxy.removeListenRoom();
    };
    RoomViewMediator.prototype.initCallback = function () {
        var viewComponent = this.viewComponent;
        var roomProxy = this.facade.retrieveProxy(RoomProxy_1.default.NAME);
        viewComponent.readyButtonClick = function (event, data) {
            console.log("ready button click");
            roomProxy.setReadyStatus(true);
        };
        viewComponent.cancelButtonClick = function (event, data) {
            console.log("cancel button click");
            roomProxy.setReadyStatus(false);
        };
        viewComponent.leaveButtonClick = function (event, data) {
            console.log("leave button click");
            roomProxy.leaveRoom();
            // this.facade.sendNotification(RoomNotification.ROOM_CANCEL);
        };
        viewComponent.inviteButtonClick = function (event, data) {
            console.log("invite button click");
            var room = roomProxy.getRoom();
            console.log("好友组队邀请", "type=" + room.gameType + "&roomId=" + room.roomId);
            IPlatform_1.Platform().shareAppMessage("房已开好，就差你了！", "", "type=" + room.gameType + "&roomId=" + room.roomId);
        };
        // viewComponent.setModeType(userProxy.getModeType());
        // let userInfo = userProxy.getUserInfo();
        // viewComponent.setUserInfo(userInfo.avatarUrl, userInfo.nickName);
        // viewComponent.mode2Button.node.on('click', (event) => {
        //     viewComponent.setModeType(4);
        //     userProxy.setModeType(4);
        // });
        // viewComponent.mode4Button.node.on('click', (event) => {
        //     viewComponent.setModeType(2);
        //     userProxy.setModeType(2);
        // });
    };
    RoomViewMediator.prototype.initView = function () {
        var viewComponent = this.viewComponent;
        var roomProxy = this.facade.retrieveProxy(RoomProxy_1.default.NAME);
        var room = roomProxy.getRoom();
        console.log("init view", room);
        viewComponent.updateRoom(room);
    };
    RoomViewMediator.NAME = "RoomViewMediator";
    return RoomViewMediator;
}(puremvc.Mediator));
exports.default = RoomViewMediator;

cc._RF.pop();
"use strict";
cc._RF.push(module, '9ca47wjz0RGKb0IiseSCFys', 'GameViewMediator');
// script/view/GameViewMediator.ts

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
var GameViewMediator = /** @class */ (function (_super) {
    __extends(GameViewMediator, _super);
    function GameViewMediator(viewComponent) {
        return _super.call(this, GameViewMediator.NAME, viewComponent) || this;
    }
    GameViewMediator.prototype.listNotificationInterests = function () {
        return [];
    };
    GameViewMediator.prototype.handleNotification = function (notification) {
        var data = notification.getBody();
        switch (notification.getName()) {
        }
    };
    GameViewMediator.prototype.onRegister = function () {
        var viewComponent = this.viewComponent;
        // const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;
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
    GameViewMediator.prototype.onRemove = function () {
    };
    GameViewMediator.NAME = "GameViewMediator";
    return GameViewMediator;
}(puremvc.Mediator));
exports.default = GameViewMediator;

cc._RF.pop();
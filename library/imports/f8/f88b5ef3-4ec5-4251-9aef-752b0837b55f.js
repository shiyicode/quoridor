"use strict";
cc._RF.push(module, 'f88b57zTsVCUZrvdSsIN7Vf', 'RoomView');
// script/view/component/RoomView.ts

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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var AppFacade_1 = require("../../AppFacade");
var RoomViewMediator_1 = require("../RoomViewMediator");
var Util_1 = require("../../util/Util");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var RoomView = /** @class */ (function (_super) {
    __extends(RoomView, _super);
    function RoomView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.playersNode = null;
        _this.barNode = null;
        _this.readyButton = null;
        _this.cancelButton = null;
        return _this;
    }
    RoomView.prototype.start = function () {
        AppFacade_1.default.getInstance().registerMediator(new RoomViewMediator_1.default(this));
    };
    RoomView.prototype.onDestroy = function () {
        AppFacade_1.default.getInstance().removeMediator(RoomViewMediator_1.default.NAME);
    };
    RoomView.prototype.update = function (dt) {
    };
    RoomView.prototype.updateRoom = function (room) {
        var playerNodeArray = [];
        var playerCnt = Util_1.default.getPlayerCntByType(room.gameType);
        if (playerCnt == 2) {
            playerNodeArray.push(this.playersNode.getChildByName("player0"));
            playerNodeArray.push(this.playersNode.getChildByName("player2"));
            this.playersNode.getChildByName("player1").active = false;
            this.playersNode.getChildByName("player3").active = false;
        }
        else {
            for (var i = 0; i < 4; i++) {
                var node = this.playersNode.getChildByName('player' + i.toString());
                playerNodeArray.push(node);
            }
        }
        for (var i = 0; i < playerCnt; i++) {
            this.setPlayerInfo(playerNodeArray[i], room.playersInfo[i].avatarUrl, room.playersInfo[i].nickName, room.playersInfo[i].isReady);
        }
        if (room.playersInfo[0].isReady != undefined) {
            this.readyButton.node.active = !room.playersInfo[0].isReady;
            this.cancelButton.node.active = room.playersInfo[0].isReady;
        }
    };
    RoomView.prototype.setPlayerInfo = function (playerNode, avatarUrl, nickName, isReady) {
        if (avatarUrl) {
            var head = playerNode.getChildByName('mask').getChildByName('head');
            var headBG_1 = head.getComponent(cc.Sprite);
            cc.loader.load({
                url: avatarUrl,
                type: 'jpg'
            }, function (err, texture) {
                console.log("加载头像", err);
                if (err == null) {
                    headBG_1.spriteFrame = new cc.SpriteFrame(texture);
                }
            });
            head.active = true;
        }
        if (nickName) {
            nickName = Util_1.default.cutstr(nickName, 5);
            var name = playerNode.getChildByName('name').getComponent(cc.Label);
            name.string = nickName;
        }
        if (isReady != undefined) {
            playerNode.getChildByName('ready_tag').active = isReady;
        }
    };
    RoomView.prototype.readyButtonClick = function (event, data) { };
    RoomView.prototype.cancelButtonClick = function (event, data) { };
    RoomView.prototype.inviteButtonClick = function (event, data) { };
    RoomView.prototype.leaveButtonClick = function (event, data) { };
    RoomView.prototype.chatButtonClick = function (event, data) { };
    __decorate([
        property(cc.Node)
    ], RoomView.prototype, "playersNode", void 0);
    __decorate([
        property(cc.Node)
    ], RoomView.prototype, "barNode", void 0);
    __decorate([
        property(cc.Button)
    ], RoomView.prototype, "readyButton", void 0);
    __decorate([
        property(cc.Button)
    ], RoomView.prototype, "cancelButton", void 0);
    RoomView = __decorate([
        ccclass
    ], RoomView);
    return RoomView;
}(cc.Component));
exports.default = RoomView;

cc._RF.pop();
"use strict";
cc._RF.push(module, 'a412dCXcExGoIv2Dq6SbnKc', 'MenuView');
// script/view/component/MenuView.ts

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
var MenuViewMediator_1 = require("../MenuViewMediator");
var Util_1 = require("../../util/Util");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var MenuView = /** @class */ (function (_super) {
    __extends(MenuView, _super);
    function MenuView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.playerNode = null;
        _this.mode2Node = null;
        _this.mode4Node = null;
        return _this;
    }
    MenuView.prototype.onLoad = function () {
    };
    MenuView.prototype.start = function () {
        AppFacade_1.default.getInstance().registerMediator(new MenuViewMediator_1.default(this));
    };
    MenuView.prototype.onDestroy = function () {
        AppFacade_1.default.getInstance().removeMediator(MenuViewMediator_1.default.NAME);
    };
    // 切换游戏模式
    MenuView.prototype.setModeType = function (modeType) {
        if (modeType == 2) {
            this.mode2Node.active = true;
            this.mode4Node.active = false;
        }
        else {
            this.mode2Node.active = false;
            this.mode4Node.active = true;
        }
    };
    // 展示用户信息
    MenuView.prototype.setUserInfo = function (avatarUrl, nickName) {
        if (avatarUrl) {
            var head = this.playerNode.getChildByName('mask').getChildByName('head');
            var headBG_1 = head.getComponent(cc.Sprite);
            head.active = true;
            cc.loader.load({
                url: avatarUrl,
                type: 'jpg'
            }, function (err, texture) {
                console.log("加载头像", err);
                if (err == null) {
                    headBG_1.spriteFrame = new cc.SpriteFrame(texture);
                }
            });
        }
        if (nickName) {
            nickName = Util_1.default.cutstr(nickName, 5);
            var name = this.playerNode.getChildByName('name').getComponent(cc.Label);
            name.string = nickName;
        }
    };
    // 在creator编辑器与按钮绑定，在mediator里实现
    MenuView.prototype.mode2ButtonClick = function (event, data) { };
    MenuView.prototype.mode4ButtonClick = function (event, data) { };
    MenuView.prototype.team2ButtonClick = function (event, data) { };
    MenuView.prototype.team4ButtonClick = function (event, data) { };
    MenuView.prototype.match2ButtonClick = function (event, data) { };
    MenuView.prototype.machine2ButtonClick = function (event, data) { };
    __decorate([
        property(cc.Node)
    ], MenuView.prototype, "playerNode", void 0);
    __decorate([
        property(cc.Node)
    ], MenuView.prototype, "mode2Node", void 0);
    __decorate([
        property(cc.Node)
    ], MenuView.prototype, "mode4Node", void 0);
    MenuView = __decorate([
        ccclass
    ], MenuView);
    return MenuView;
}(cc.Component));
exports.default = MenuView;

cc._RF.pop();
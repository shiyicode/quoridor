"use strict";
cc._RF.push(module, 'e8f31Ef7w1IZr7rEQ1PVtqD', 'WelcomeView');
// script/view/component/WelcomeView.ts

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
var WelcomeViewMediator_1 = require("../WelcomeViewMediator");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var WelcomeView = /** @class */ (function (_super) {
    __extends(WelcomeView, _super);
    function WelcomeView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.popupLayer = null;
        return _this;
    }
    WelcomeView.prototype.start = function () {
        AppFacade_1.default.getInstance().registerMediator(new WelcomeViewMediator_1.default(this));
    };
    WelcomeView.prototype.onDestroy = function () {
        AppFacade_1.default.getInstance().removeMediator(WelcomeViewMediator_1.default.NAME);
    };
    WelcomeView.prototype.update = function (dt) {
    };
    __decorate([
        property(cc.Node)
    ], WelcomeView.prototype, "popupLayer", void 0);
    WelcomeView = __decorate([
        ccclass
    ], WelcomeView);
    return WelcomeView;
}(cc.Component));
exports.default = WelcomeView;

cc._RF.pop();
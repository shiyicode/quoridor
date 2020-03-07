"use strict";
cc._RF.push(module, '6704dlSDhRMJYOXjwusSjDq', 'PopupView');
// script/view/component/PopupView.ts

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
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var PopupView = /** @class */ (function (_super) {
    __extends(PopupView, _super);
    function PopupView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loadingNode = null;
        return _this;
    }
    PopupView.prototype.onLoad = function () {
        // 旋转增量
    };
    PopupView.prototype.start = function () {
        this.loadingNode.active = false;
    };
    PopupView.prototype.showLoading = function () {
        this.loadingNode.active = true;
    };
    PopupView.prototype.hideLoading = function () {
        this.loadingNode.active = false;
    };
    PopupView.prototype.update = function (dt) {
        if (this.loadingNode.active) {
            this.rotateLoadingFrame();
        }
    };
    PopupView.prototype.rotateLoadingFrame = function () {
        var rotationInc = 5;
        var loadingIcon = this.loadingNode.getChildByName('load_icon');
        loadingIcon.angle -= rotationInc;
    };
    __decorate([
        property(cc.Node)
    ], PopupView.prototype, "loadingNode", void 0);
    PopupView = __decorate([
        ccclass
    ], PopupView);
    return PopupView;
}(cc.Component));
exports.default = PopupView;

cc._RF.pop();
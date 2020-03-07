"use strict";
cc._RF.push(module, 'adccctWljBJtY+ZGVmHgZJB', 'WelcomeViewMediator');
// script/view/WelcomeViewMediator.ts

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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("../Constants");
var UserProxy_1 = require("../model/UserProxy");
var IPlatform_1 = require("../services/platform/IPlatform");
var MgobeService_1 = require("../services/mgobe/MgobeService");
var WelcomeViewMediator = /** @class */ (function (_super) {
    __extends(WelcomeViewMediator, _super);
    function WelcomeViewMediator(viewComponent) {
        return _super.call(this, WelcomeViewMediator.NAME, viewComponent) || this;
    }
    WelcomeViewMediator.prototype.listNotificationInterests = function () {
        return [];
    };
    WelcomeViewMediator.prototype.handleNotification = function (notification) {
        var data = notification.getBody();
        switch (notification.getName()) {
        }
    };
    WelcomeViewMediator.prototype.onRegister = function () {
        this.initialization();
        this.registerOnShow();
    };
    WelcomeViewMediator.prototype.onRemove = function () {
    };
    WelcomeViewMediator.prototype.initialization = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userProxy, openId, userInfo;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userProxy = this.facade.retrieveProxy(UserProxy_1.default.NAME);
                        return [4 /*yield*/, IPlatform_1.Platform().getOpenID()];
                    case 1:
                        openId = _a.sent();
                        userProxy.setOpenId(openId);
                        return [4 /*yield*/, IPlatform_1.Platform().authorize()];
                    case 2:
                        _a.sent();
                        // 展示loading
                        this.viewComponent.popupLayer.getComponent("PopupView").showLoading();
                        if (!!userProxy.getUserInfo().avatarUrl) return [3 /*break*/, 4];
                        return [4 /*yield*/, IPlatform_1.Platform().getUserInfo()];
                    case 3:
                        userInfo = _a.sent();
                        userProxy.setUserInfo(userInfo);
                        _a.label = 4;
                    case 4:
                        // 初始化 Mgobe SDK
                        MgobeService_1.default.initMgobeSDK(userProxy.getOpenId(), Constants_1.Config.MGOBEGameId, Constants_1.Config.MGOBESecretKey, Constants_1.Config.MGOBEHost, "", function (res) {
                            if (res.code === MGOBE.ErrCode.EC_OK) {
                                userProxy.setPlayerId(MGOBE.Player.id);
                                // 获取启动参数
                                _this.loadLaunchOption();
                                // 初始化成功，跳转到主界面
                                cc.director.loadScene(Constants_1.Scene.MENU);
                            }
                            else {
                                // TODO 失败，展示重试对话框
                                console.log("initialization fail");
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    // 启动时，获取launch参数
    WelcomeViewMediator.prototype.loadLaunchOption = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userProxy, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userProxy = this.facade.retrieveProxy(UserProxy_1.default.NAME);
                        return [4 /*yield*/, IPlatform_1.Platform().getLaunchOption()];
                    case 1:
                        res = _a.sent();
                        if (res) {
                            userProxy.setLaunch(res);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    WelcomeViewMediator.prototype.registerOnShow = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userProxy, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userProxy = this.facade.retrieveProxy(UserProxy_1.default.NAME);
                        return [4 /*yield*/, IPlatform_1.Platform().getLaunchOptionOnShow()];
                    case 1:
                        res = _a.sent();
                        console.log("onShow", res);
                        userProxy.setLaunch(res);
                        return [2 /*return*/];
                }
            });
        });
    };
    WelcomeViewMediator.NAME = "WelcomeViewMediator";
    return WelcomeViewMediator;
}(puremvc.Mediator));
exports.default = WelcomeViewMediator;

cc._RF.pop();
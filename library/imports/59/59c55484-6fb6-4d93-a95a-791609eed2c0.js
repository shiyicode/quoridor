"use strict";
cc._RF.push(module, '59c55SEb7ZNk6laeRYJ7tLA', 'WXPlatform');
// script/services/platform/WXPlatform.ts

"use strict";
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
var wxApi_1 = require("../../library/wechat/wxApi");
var WXPlatform = /** @class */ (function () {
    function WXPlatform() {
    }
    WXPlatform.prototype.getOpenID = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("get openId");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, wxApi_1.wxApi.callFunction("login")];
                    case 2:
                        res = _a.sent();
                        console.log("call login succ", res);
                        return [2 /*return*/, res.result.openid];
                    case 3:
                        e_1 = _a.sent();
                        console.log("call login fail", e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WXPlatform.prototype.authorize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_2, x, y, button_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, wxApi_1.wxApi.authorize("scope.userInfo")];
                    case 1:
                        _a.sent();
                        console.log('authorize already');
                        return [3 /*break*/, 4];
                    case 2:
                        e_2 = _a.sent();
                        console.log("authorize wait");
                        x = window.innerWidth / 2 - 250 / 2;
                        y = window.innerHeight / 1.2;
                        button_1 = wx.createUserInfoButton({
                            type: "text",
                            text: "微信登陆",
                            image: "",
                            style: {
                                left: x,
                                top: y,
                                width: 250,
                                height: 43,
                                lineHeight: 43,
                                backgroundColor: "#FC3768",
                                color: "#ffffff",
                                textAlign: "center",
                                fontSize: 18,
                                borderRadius: 4
                            }
                        });
                        /** 用户点击登陆按钮后获取userInfo */
                        return [4 /*yield*/, new Promise(function (resolve) {
                                button_1.onTap(function (res) {
                                    console.log("authorize finish:", res);
                                    if (res.userInfo) {
                                        button_1.destroy();
                                        resolve();
                                    }
                                });
                            })];
                    case 3:
                        /** 用户点击登陆按钮后获取userInfo */
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WXPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, wxApi_1.wxApi.getUserInfo(false, "zh_CN")];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.userInfo];
                }
            });
        });
    };
    WXPlatform.prototype.shareAppMessage = function (title, imageUrl, query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                wx.shareAppMessage({
                    title: title,
                    imageUrl: imageUrl,
                    query: query,
                });
                return [2 /*return*/];
            });
        });
    };
    WXPlatform.prototype.getLaunchOption = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                res = wx.getLaunchOptionsSync();
                if (res && res.query) {
                    return [2 /*return*/, {
                            query: res.query,
                            scene: res.scene,
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    WXPlatform.prototype.getLaunchOptionOnShow = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, wxApi_1.wxApi.onShow()];
                    case 1:
                        res = _a.sent();
                        if (res && res.query) {
                            return [2 /*return*/, {
                                    query: res.query,
                                    scene: res.scene,
                                }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    WXPlatform.prototype.showLoading = function (title) {
        if (title === void 0) { title = ""; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                wx.showLoading({
                    title: title,
                    mask: true
                });
                return [2 /*return*/];
            });
        });
    };
    WXPlatform.prototype.hideLoading = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                wx.hideLoading({});
                return [2 /*return*/];
            });
        });
    };
    WXPlatform.prototype.showToast = function (title, duration) {
        if (duration === void 0) { duration = 1000; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                wx.showToast({
                    title: title,
                    icon: 'none',
                    duration: duration,
                });
                return [2 /*return*/];
            });
        });
    };
    WXPlatform.prototype.hideToast = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                wx.hideToast({});
                return [2 /*return*/];
            });
        });
    };
    return WXPlatform;
}());
exports.default = WXPlatform;

cc._RF.pop();
"use strict";
cc._RF.push(module, '7a96eQ70IBDtrSyAUngGjty', 'wxApi');
// script/library/wechat/wxApi.ts

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
var Constants_1 = require("../../Constants");
var wxApi = /** @class */ (function () {
    function wxApi() {
    }
    wxApi.login = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        wx.login({
                            success: function (code) {
                                resolve(code);
                            },
                            fail: function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                reject.apply(void 0, args);
                            },
                            complete: function () {
                            },
                        });
                    })];
            });
        });
    };
    wxApi.callFunction = function (name) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                // 在调用云开发各 API 前，需先调用初始化方法 init 一次（全局只需一次，多次调用时只有第一次生效）
                wx.cloud.init({
                    env: Constants_1.Config.WXCloudEnvID,
                });
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        wx.cloud.callFunction({
                            name: name,
                            success: function (res) {
                                resolve(res);
                            },
                            fail: function () {
                                reject();
                            },
                            complete: function () {
                            },
                        });
                    })];
            });
        });
    };
    wxApi.checkSession = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        console.log("wx checksession");
                        wx.checkSession({
                            success: function () {
                                resolve();
                            },
                            fail: function () {
                                reject();
                            },
                            complete: function () {
                            },
                        });
                    })];
            });
        });
    };
    wxApi.authorize = function (scope) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        wx.authorize({
                            scope: scope,
                            success: function (res) {
                                resolve(res);
                            },
                            fail: function (res) {
                                reject(res);
                            }
                        });
                    })];
            });
        });
    };
    wxApi.getUserInfo = function (withCredentials, lang) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        wx.getUserInfo({
                            withCredentials: withCredentials,
                            lang: lang,
                            success: function (res) {
                                resolve(res);
                            },
                            fail: function (res) {
                                reject(res);
                            }
                        });
                    })];
            });
        });
    };
    wxApi.getSetting = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        wx.getSetting({
                            success: function (res) {
                                resolve(res);
                            },
                            fail: function () {
                                reject();
                            }
                        });
                    })];
            });
        });
    };
    wxApi.authSettingOfUserInfo = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var res, e_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, wxApi.getSetting()];
                                case 1:
                                    res = _a.sent();
                                    if (res.authSetting && res.authSetting['scope.userInfo']) {
                                        resolve(true);
                                    }
                                    else {
                                        resolve(false);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_1 = _a.sent();
                                    resolve(false);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    wxApi.onShow = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            wx.onShow(function (res) {
                                resolve(res);
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    // static showLoading(title: string = "") {
    //     wx.showLoading({
    //         title: title,
    //         mask: true
    //     });
    // }
    // static hideLoading() {
    //     wx.hideLoading({
    //     });
    // }
    // static showToast(title: string, duration: any = 1000) {
    //     wx.showToast({
    //         title: title,
    //         icon: 'success',
    //         duration: duration,
    //     });
    // }
    // static hideLoading() {
    //     wx.hideLoading({
    //     });
    // }
    wxApi.getUserGameLabel = function () {
    };
    return wxApi;
}());
exports.wxApi = wxApi;

cc._RF.pop();
(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/model/UserProxy.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2c087vE7fxBJ6jTcleAgUMg', 'UserProxy', __filename);
// script/model/UserProxy.ts

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
var UserVO_1 = require("./vo/UserVO");
var UserProxy = /** @class */ (function (_super) {
    __extends(UserProxy, _super);
    function UserProxy() {
        var _this = _super.call(this, UserProxy.NAME) || this;
        _this.user = null;
        _this.launch = null;
        _this.user = new UserVO_1.UserVO();
        return _this;
    }
    UserProxy.getInstance = function () {
        if (!this.instance) {
            this.instance = new UserProxy();
        }
        return this.instance;
    };
    UserProxy.prototype.setOpenId = function (openId) {
        this.user.openId = openId;
    };
    UserProxy.prototype.getOpenId = function () {
        return this.user.openId;
    };
    UserProxy.prototype.setPlayerId = function (playerId) {
        this.user.playerId = playerId;
    };
    UserProxy.prototype.getPlayerId = function () {
        return this.user.playerId;
    };
    UserProxy.prototype.setUserInfo = function (userInfo) {
        console.log("update user info", userInfo);
        this.user.avatarUrl = userInfo.avatarUrl;
        this.user.nickName = userInfo.nickName;
        this.user.city = userInfo.city;
        this.user.country = userInfo.country;
        this.user.gender = userInfo.gender;
        this.user.province = userInfo.province;
    };
    UserProxy.prototype.getUserInfo = function () {
        return {
            avatarUrl: this.user.avatarUrl,
            nickName: this.user.nickName,
        };
    };
    UserProxy.prototype.setModeType = function (modeType) {
        this.user.modeType = modeType;
    };
    UserProxy.prototype.getModeType = function () {
        return this.user.modeType;
    };
    UserProxy.prototype.hasAuthorize = function () {
        return this.user.openId != null;
    };
    UserProxy.prototype.setLaunch = function (launch) {
        this.launch = launch;
    };
    UserProxy.prototype.getLaunch = function () {
        if (this.launch) {
            return {
                query: this.launch.query,
                scene: this.launch.scene,
            };
        }
    };
    UserProxy.NAME = "UserProxy";
    UserProxy.instance = null;
    return UserProxy;
}(puremvc.Proxy));
exports.default = UserProxy;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=UserProxy.js.map
        
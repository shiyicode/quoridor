(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/AppFacade.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9bd88dxjkxI86h2WuaC9sGd', 'AppFacade', __filename);
// script/AppFacade.ts

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
var UserProxy_1 = require("./model/UserProxy");
var UserCommand_1 = require("./controller/UserCommand");
var RoomProxy_1 = require("./model/RoomProxy");
var GameCommand_1 = require("./controller/GameCommand");
var AppFacade = /** @class */ (function (_super) {
    __extends(AppFacade, _super);
    function AppFacade() {
        return _super.call(this) || this;
    }
    AppFacade.getInstance = function () {
        if (AppFacade.instance == null) {
            AppFacade.instance = new AppFacade();
        }
        return (AppFacade.instance);
    };
    // 启动pureMvc
    AppFacade.prototype.startup = function () {
    };
    // 以下是该类的初始化函数，创建改类实例后会自动调用改函数
    AppFacade.prototype.initializeFacade = function () {
        _super.prototype.initializeFacade.call(this);
    };
    // 注册数据模型
    AppFacade.prototype.initializeModel = function () {
        _super.prototype.initializeModel.call(this);
        this.registerProxy(new UserProxy_1.default());
        this.registerProxy(new RoomProxy_1.default());
    };
    // 注册控制器
    AppFacade.prototype.initializeController = function () {
        _super.prototype.initializeController.call(this);
        (new UserCommand_1.default()).register();
        (new GameCommand_1.default()).register();
    };
    // 注册View视图
    AppFacade.prototype.initializeView = function () {
        _super.prototype.initializeView.call(this);
    };
    AppFacade.STARTUP = 'startup';
    return AppFacade;
}(puremvc.Facade));
exports.default = AppFacade;

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
        //# sourceMappingURL=AppFacade.js.map
        
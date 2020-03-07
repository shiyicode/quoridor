(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/controller/UserCommand.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a2eeb3+f7dEmoETuYbm6Zy+', 'UserCommand', __filename);
// script/controller/UserCommand.ts

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
var Constants_1 = require("../Constants");
var UserCommand = /** @class */ (function (_super) {
    __extends(UserCommand, _super);
    function UserCommand() {
        return _super.call(this) || this;
    }
    /**
     * 注册消息
     */
    UserCommand.prototype.register = function () {
        this.facade.registerCommand(Constants_1.UserNotification.AUTHORIZE, UserCommand);
    };
    UserCommand.prototype.execute = function (notification) {
        var data = notification.getBody();
        switch (notification.getName()) {
        }
    };
    UserCommand.NAME = 'UserCommand';
    return UserCommand;
}(puremvc.SimpleCommand));
exports.default = UserCommand;

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
        //# sourceMappingURL=UserCommand.js.map
        
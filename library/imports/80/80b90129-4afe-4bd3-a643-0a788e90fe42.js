"use strict";
cc._RF.push(module, '80b90EpSv5L06ZDCniOkP5C', 'GameCommand');
// script/controller/GameCommand.ts

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
// import { Platform } from "../services/platform/IPlatform";
var GameCommand = /** @class */ (function (_super) {
    __extends(GameCommand, _super);
    function GameCommand() {
        return _super.call(this) || this;
    }
    /**
     * 注册消息
     */
    GameCommand.prototype.register = function () {
    };
    GameCommand.prototype.execute = function (notification) {
        var gameType = notification.getBody().gameType;
        switch (notification.getName()) {
        }
    };
    GameCommand.NAME = 'GameCommand';
    return GameCommand;
}(puremvc.SimpleCommand));
exports.default = GameCommand;

cc._RF.pop();
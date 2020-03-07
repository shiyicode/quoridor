(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/services/platform/IPlatform.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '17710N0H3FDNI01GLjbmctM', 'IPlatform', __filename);
// script/services/platform/IPlatform.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WXPlatform_1 = require("./WXPlatform");
var DevPlatform_1 = require("./DevPlatform");
var platform;
function Platform() {
    if (platform != null) {
        return platform;
    }
    switch (cc.sys.platform) {
        case cc.sys.WECHAT_GAME:
            platform = new WXPlatform_1.default();
            break;
        default:
            platform = new DevPlatform_1.default();
    }
    return platform;
}
exports.Platform = Platform;

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
        //# sourceMappingURL=IPlatform.js.map
        
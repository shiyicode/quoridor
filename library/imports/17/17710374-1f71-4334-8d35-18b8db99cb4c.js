"use strict";
cc._RF.push(module, '17710N0H3FDNI01GLjbmctM', 'IPlatform');
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
"use strict";
cc._RF.push(module, '2c091hmZBNGxYOoU8JSvA6c', 'Util');
// script/util/Util.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("../Constants");
var Util = /** @class */ (function () {
    function Util() {
    }
    /**
     * js截取字符串，中英文都能用
     * @param str：需要截取的字符串
     * @param len: 需要截取的长度
     */
    Util.cutstr = function (str, len) {
        var str_length = 0;
        var str_cut = new String();
        var str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            var a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length >= len) {
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
        //如果给定字符串小于指定长度，则返回源字符串；
        if (str_length < len) {
            return str;
        }
    };
    Util.getPlayerCntByType = function (gameType) {
        if (gameType == Constants_1.GameType.MACHINE2 || gameType == Constants_1.GameType.MATCH2
            || gameType == Constants_1.GameType.TEAM2) {
            return 2;
        }
        else {
            return 4;
        }
    };
    Util.loadScene = function (scene) {
        cc.director.preloadScene(scene, function () {
            cc.log("Next scene preloaded:", scene);
        });
        cc.director.loadScene(scene);
    };
    return Util;
}());
exports.default = Util;

cc._RF.pop();
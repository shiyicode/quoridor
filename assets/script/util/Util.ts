import { GameType, Scene } from "../Constants";

export default class Util {
    /**
     * js截取字符串，中英文都能用
     * @param str：需要截取的字符串
     * @param len: 需要截取的长度
     */
    static cutstr(str, len) {
        let  str_length = 0;
        let str_cut = new String();
        let str_len = str.length;
        for (let i = 0; i < str_len; i++) {
            let a = str.charAt(i);
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
    }

    static getPlayerCntByType(gameType: GameType): number {
        if(gameType == GameType.MACHINE2 || gameType == GameType.MATCH2
            || gameType == GameType.TEAM2) {
            return 2;
        } else {
            return 4;
        }
    }

    static loadScene(scene: Scene) {
        cc.director.preloadScene(scene, function () {
            cc.log("Next scene preloaded:", scene);
        });
        cc.director.loadScene(scene);
    }

    static random(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }

}
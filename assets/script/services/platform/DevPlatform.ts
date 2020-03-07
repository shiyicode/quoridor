import { IPlatform } from "./IPlatform";
import { wxApi } from "../../library/wechat/wxApi";

export default class DevPlatform implements IPlatform {
    async getOpenID() {
        return "user dev";
    }

    async authorize() {

    }

    async getUserInfo() {
        return {
            avatarUrl: "https://blog.shiyicode.com/image/avatar.png",
            nickName: "疯逍sadsada",
            gender: 1,
            language: "zh_CN",
            city: "海淀",
            province: "北京",
            country: "中国",
        };
    }

    async shareAppMessage(title: string, imageUrl: string, query: string) {
        console.log("share app message:", query);
    }

    async getLaunchOption() {

    }

    getLaunchOptionOnShow(callback: (query: any, scene: any) => any) {
    }
}
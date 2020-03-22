import { IPlatform } from "./IPlatform";
import { wxApi } from "../../library/wechat/wxApi";
import AppFacade from "../../AppFacade";
import RoomProxy from "../../model/RoomProxy";

export default class DevPlatform implements IPlatform {

    static mockOpenId = ((): string => {
        let str = Date.now().toString(36);

        for (let i = 0; i < 7; i++) {
            str += Math.ceil(Math.random() * (10 ** 4)).toString(36);
        }
        console.log("随机OpenId", str.substr(str.length-10));
        return str.substr(str.length-10);
    })();

    async getOpenID() {
        return DevPlatform.mockOpenId;
    }

    async authorize() {

    }

    async getUserInfo() {
        return {
            avatarUrl: "https://blog.shiyicode.com/image/avatar.png",
            nickName: DevPlatform.mockOpenId,
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

    showLoading(title: string = "", isMask: boolean = false) {
        console.log("展示Loading", title, isMask);
    }

    hideLoading() {
        console.log("隐藏Loading");
    }

    showToast(title: string, duration: any = 1000) {
        console.log("展示toast", title, duration);
    }

    hideToast() {
        console.log("隐藏Toast");
    }

    showModal() {
        console.log("展示Modal");
        console.log("忽略已进行中的游戏");
        const roomProxy = AppFacade.getInstance().retrieveProxy(RoomProxy.NAME) as RoomProxy;

        roomProxy.leaveRoom();
    }

    hideModal() {

    }
}
import { IPlatform } from "./IPlatform";
import { wxApi } from "../../library/wechat/wxApi";
import AppFacade from "../../AppFacade";
import RoomProxy from "../../model/RoomProxy";

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
        console.log("隐藏Loading");
    }

    showModal() {
        console.log("隐藏Loading");
        console.log("忽略已进行中的游戏");
        const roomProxy = AppFacade.getInstance().retrieveProxy(RoomProxy.NAME) as RoomProxy;

        roomProxy.leaveRoom();
    }

    hideModal() {

    }
}
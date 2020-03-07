import WXPlatform from "./WXPlatform";
import DevPlatform from "./DevPlatform";

export interface IPlatform {
    getOpenID(): Promise<any>;
    authorize(): Promise<any>;
    getUserInfo(): Promise<any>;
    shareAppMessage(title: string, imageUrl: string, query: string): Promise<any>;
    getLaunchOption(): Promise<any>;
    getLaunchOptionOnShow(callback: (query: any, scene: any) => any);
}

let platform: IPlatform;
export function Platform() {
    if (platform != null) {
        return platform;
    }
    switch (cc.sys.platform) {
        case cc.sys.WECHAT_GAME:
            platform = new WXPlatform();
            break;
        default:
            platform = new DevPlatform();
    }
    return platform;
}
import WXPlatform from "./WXPlatform";
import DevPlatform from "./DevPlatform";

export interface IPlatform {
    getOpenID(): Promise<any>;
    authSettingOfUserInfo(): Promise<any>;
    createUserInfoButton();
    getUserInfo(): Promise<any>;
    shareAppMessage(title: string, imageUrl: string, imageUrlId: string, query: string): Promise<any>;
    getLaunchOption(): Promise<any>;
    getLaunchOptionOnShow(callback: (query: any, scene: any) => any);
    showLoading(title?: string, isMask?: boolean);
    hideLoading();
    showToast(title?: string, duration?: any);
    hideToast();
    showModal(title:string, callback: (isConfirm: boolean) => any, content?:string, showCancel?:any, confirmText?: any,
    cancelText?: any);
    hideModal();
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
import { Scene, Config, RoomNotification } from "../Constants";
import UserProxy from "../model/UserProxy";
import { Platform } from "../services/platform/IPlatform";
import MgobeService from "../services/mgobe/MgobeService";
import RoomProxy from "../model/RoomProxy";

export default class WelcomeViewMediator extends puremvc.Mediator implements puremvc.IMediator {
    public static NAME: string = "WelcomeViewMediator";

    public constructor(viewComponent: any) {
        super(WelcomeViewMediator.NAME, viewComponent);
    }

    public listNotificationInterests(): string[] {
        return [
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const data = notification.getBody();
        switch (notification.getName()) {
        }
    }

    public onRegister(): void {
        this.initialization();
        this.registerOnShow();
    }

    public onRemove(): void {
    }

    public async initialization() {
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;

        // 获取用户唯一标识
        // if (!userProxy.getOpenId()) {
        //     let openId = await Platform().getOpenID();
        //     userProxy.setOpenId(openId);
        // }

        let openId = await Platform().getOpenID();
        userProxy.setOpenId(openId);

        await Platform().authorize();

        // 展示loading
        this.viewComponent.popupLayer.getComponent("PopupView").showLoading();

        // 获取用户信息
        if (!userProxy.getUserInfo().avatarUrl) {
            let userInfo = await Platform().getUserInfo();
            userProxy.setUserInfo(userInfo);
        }

        // 初始化 Mgobe SDK
        MgobeService.initMgobeSDK(userProxy.getOpenId(), Config.MGOBEGameId, Config.MGOBESecretKey,
            Config.MGOBEHost, "", (res: { code: MGOBE.ErrCode }) => {
                if (res.code === MGOBE.ErrCode.EC_OK) {
                    userProxy.setPlayerId(MGOBE.Player.id);
                    // 获取启动参数
                    this.loadLaunchOption();
                    // 初始化成功，跳转到主界面
                    cc.director.loadScene(Scene.MENU);
                } else {
                    console.log("initialization fail");
                    Platform().showModal("提示", (isConfirm) => {
                        if(isConfirm) {
                            this.initialization();
                        }
                    }, "初始化失败，点击重试", false, "确认");
                }
            });
    }

    // 启动时，获取launch参数
    async loadLaunchOption() {
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;

        let res = await Platform().getLaunchOption();
        console.log("获取launch参数", res);
        if (res) {
            userProxy.setLaunch(res);
        }
    }

    async registerOnShow() {
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;

        Platform().getLaunchOptionOnShow((query:any, scene:any) => {
            console.log("再次进入界面OnShow", query, scene);
            userProxy.setLaunch({query: query, scene: scene});
            this.facade.sendNotification(RoomNotification.ROOM_RETURN_NOT_CHECK);
        });
    }
}
import { Scene, Config, RoomNotification, WorldNotification } from "../Constants";
import UserProxy from "../model/UserProxy";
import { Platform } from "../services/platform/IPlatform";
import MgobeService from "../services/mgobe/MgobeService";
import RoomProxy from "../model/RoomProxy";
import { UIManager } from "../manager/UIManager";
import MenuView from "./component/MenuView";
import { WelcomeView } from "./component/WelcomeView";
import { Tip } from "./component/Tip";

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

        await UIManager.getInstance().showLoadingSync(false);

        // 获取 用户唯一标识
        let openId = await Platform().getOpenID();
        if(openId == "") {
            Platform().showModal("提示", (isConfirm) => {
                if(isConfirm) {
                    this.initialization();
                }
            }, "游戏初始化失败，确认重试?", false, "确认");
            return;
        }
        userProxy.setOpenId(openId);


        let isAuthorize = await Platform().authSettingOfUserInfo();
        if (isAuthorize) {
            console.log('authorize already');
        } else {
            console.log("authorize wait");
            UIManager.getInstance().hideLoading();
            await Platform().createUserInfoButton();
            await UIManager.getInstance().showLoadingSync(false);
        }

        // 获取用户信息
        if (!userProxy.getUserInfo().avatarUrl) {
            let userInfo = await Platform().getUserInfo();
            userProxy.setUserInfo(userInfo);
        }

        // 初始化 Mgobe SDK
        MgobeService.initMgobeSDK(userProxy.getOpenId(), Config.MGOBEGameId, Config.MGOBESecretKey,
            Config.MGOBEHost, "", (res: { code: MGOBE.ErrCode }) => {
                if (res.code === MGOBE.ErrCode.EC_OK) {
                    console.log("初始化SDK成功", MGOBE.Player.id);
                    userProxy.setPlayerId(MGOBE.Player.id);
                    // 获取启动参数
                    this.loadLaunchOption();
                    // 初始化成功，跳转到主界面
                    UIManager.getInstance().openUISync(MenuView, 0, () => {
                        UIManager.getInstance().hideLoading();
                        UIManager.getInstance().closeUI(WelcomeView);
                    });
                } else {
                    console.log("初始化SDK失败");
                    Platform().showModal("提示", (isConfirm) => {
                        if(isConfirm) {
                            this.initialization();
                        }
                    }, "游戏启动失败，确认重试?", false, "确认");
                }
            });
    }

    // 启动时，获取launch参数
    async loadLaunchOption() {
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;

        let res = await Platform().getLaunchOption();
        console.log("启动时，获取launch参数", res);
        if (res) {
            userProxy.setLaunch(res);
        }
    }

    async registerOnShow() {
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;

        Platform().getLaunchOptionOnShow((query:any, scene:any) => {
            console.log("再次进入界面OnShow", query, scene);
            userProxy.setLaunch({query: query, scene: scene});
            this.facade.sendNotification(WorldNotification.RUN_LAUNCH);
        });
    }
}
import { UserVO } from "./vo/UserVO";

export default class UserProxy extends puremvc.Proxy implements puremvc.IProxy {
    public static NAME: string = "UserProxy";
    private static instance: UserProxy = null;
    private user: UserVO = null;

    public static getInstance() {
        if (!this.instance) {
            this.instance = new UserProxy();
        }
        return this.instance;
    }

    public constructor() {
        super(UserProxy.NAME);
        this.user = new UserVO();
    }

    // 设置用户信息
    public setUserInfo(userInfo: any) {
        this.user.avatarUrl = userInfo.avatarUrl;
        this.user.nickName = userInfo.nickName;
        this.user.city = userInfo.city;
        this.user.country = userInfo.country;
        this.user.gender = userInfo.gender;
        this.user.province = userInfo.province;
    }

    public getUserInfo() {
        return {
            avatarUrl: this.user.avatarUrl,
            nickName: this.user.nickName,
        };
    }

    // 设置唯一标识
    public setOpenId(openId: string) {
        this.user.openId = openId;
    }

    public getOpenId() {
        return this.user.openId;
        // return cc.sys.platform + this.user.openId;
    }

    // 设置玩家id
    public setPlayerId(playerId: string) {
        this.user.playerId = playerId;
    }

    public getPlayerId() {
        return this.user.playerId;
    }

    // 设置菜单模式
    public setModeType(modeType: number) {
        this.user.modeType = modeType;
    }

    public getModeType() {
        return this.user.modeType;
    }

    // 设置启动信息
    public setLaunch(launch) {
        this.user.launch = launch;
    }

    public getLaunch() {
        if (this.user.launch) {
            return {
                query: this.user.launch.query,
                scene: this.user.launch.scene,
            }
        }
    }
}
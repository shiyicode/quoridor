import { UserVO } from "./vo/UserVO";

export default class UserProxy extends puremvc.Proxy implements puremvc.IProxy {
    public static NAME: string = "UserProxy";
    private static instance: UserProxy = null;
    private user: UserVO = null;
    private launch: { query, scene } = null;

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

    public setOpenId(openId: string) {
        this.user.openId = openId;
    }

    public getOpenId() {
        return this.user.openId;
    }

    public setPlayerId(playerId: string) {
        this.user.playerId = playerId;
    }

    public getPlayerId() {
        return this.user.playerId;
    }

    public setUserInfo(userInfo: any) {
        console.log("update user info", userInfo);
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

    public setModeType(modeType: number) {
        this.user.modeType = modeType;
    }

    public getModeType() {
        return this.user.modeType;
    }

    public hasAuthorize(): boolean {
        return this.user.openId != null;
    }

    public setLaunch(launch) {
        this.launch = launch;
    }

    public getLaunch() {
        if (this.launch) {
            return {
                query: this.launch.query,
                scene: this.launch.scene,
            }
        }
    }
}
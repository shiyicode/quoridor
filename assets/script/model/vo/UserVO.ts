export class UserVO {
    // 用户唯一标识
    public openId: string;   // 微信后台用户唯一标识

    public playerId: string; // MGOBE后台生成的玩家ID

    /** 昵称 */
    public nickName: string;
    /** 头像url */
    public avatarUrl: string;
    /** 性别 0：未知、1：男、2：女  */
    public gender: number;
    /** 省份 */
    public province: string;
    /** 城市 */
    public city: string;
    /** 国家 */
    public country: string;

    // 模式 2人、4人
    public modeType: number = 2;

    public constructor() {
    }
}
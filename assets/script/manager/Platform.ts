export abstract class Platform {
    private static instance: Platform;

    public static getInstance(): Platform {
        if (this.instance == null) {
            switch (cc.sys.platform) {
                case cc.sys.WECHAT_GAME:
                    this.instance = new WXPlatform();
                    break;
                default:
                    this.instance = new DevPlatform();
            }
        }

        return this.instance;
    }
}

export class WXPlatform extends Platform {

}

export class DevPlatform extends Platform {

}
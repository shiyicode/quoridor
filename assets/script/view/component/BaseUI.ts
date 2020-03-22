import { ProjectConfig } from "../../Constants";

export interface UIClass<T extends BaseUI> {
    new(): T;
    getUrl(): string;
}

const { ccclass, property } = cc._decorator;
@ccclass
export abstract class BaseUI extends cc.Component {
    protected static NAME = "BaseUI";

    protected mTag: any;
    public get tag(): any {
        return this.mTag;
    }
    public set tag(value: any) {
        this.mTag = value;
    }

    public static getUrl(): string {
        cc.log(this.NAME);
        return ProjectConfig.PREFAB_UI_DIR + this.NAME;
    }

    onDestroy(): void {
        // ListenerManager.getInstance().removeAll(this);
    }

    onShow() {
        cc.log("BaseUI onShow");
    }
}
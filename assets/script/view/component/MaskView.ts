import { BaseUI } from "./BaseUI";
import { Tip } from "./Tip";
import { ProjectConfig } from "../../Constants";

const {ccclass, property} = cc._decorator;

@ccclass
export class MaskView extends BaseUI {

    protected static NAME = "MaskView";

    static getUrl():string {
        return ProjectConfig.PREFAB_UI_DIR + MaskView.NAME;
    }

    @property(cc.Node)
    private loadIcon: cc.Node = null;
    @property(cc.Node)
    private maskBg: cc.Node = null;

    onLoad() {

    }
}
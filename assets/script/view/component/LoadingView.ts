import { BaseUI } from "./BaseUI";
import { Tip } from "./Tip";
import { ProjectConfig } from "../../Constants";

const {ccclass, property} = cc._decorator;

@ccclass
export class LoadingView extends BaseUI {

    protected static NAME = "LoadingView";

    static getUrl():string {
        return ProjectConfig.PREFAB_UI_DIR + LoadingView.NAME;
    }

    @property(cc.Node)
    private loadNode: cc.Node = null;
    @property(cc.Node)
    private maskBg: cc.Node = null;

    onLoad() {
        this.hideLoading();
    }

    showLoading(isMask: boolean = false) {
        this.loadNode.active = true;
        this.maskBg.active = isMask;
    }

    hideLoading() {
        this.loadNode.active = false;
        this.maskBg.active = false;
    }

    update(dt) {
        if (this.loadNode.active) {
            this.rotateLoadingFrame();
        }
    }

    private rotateLoadingFrame() {
        let rotationInc = 5;
        let loadingIcon = this.loadNode.getChildByName('LoadIcon');
        loadingIcon.angle -= rotationInc;
    }
}
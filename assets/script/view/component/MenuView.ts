import AppFacade from "../../AppFacade";
import MenuViewMediator from "../MenuViewMediator";
import Util from "../../util/Util";
import { ProjectConfig } from "../../Constants";
import { BaseUI } from "./BaseUI";
import { HelpView } from "./HelpView";
import { UIManager } from "../../manager/UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MenuView extends BaseUI {

    public static NAME = "MenuView";

    static getUrl():string {
        return ProjectConfig.PREFAB_UI_DIR + MenuView.NAME;
    }

    @property(cc.Node)
    playerNode: cc.Node = null;
    @property(cc.Node)
    mode2Button: cc.Node = null;
    @property(cc.Node)
    mode4Button: cc.Node = null;
    @property(cc.Node)
    helpButton: cc.Node = null;
    @property(cc.Node)
    rankButton: cc.Node = null;
    @property(cc.Node)
    machineButton: cc.Node = null;
    @property(cc.Node)
    teamButton: cc.Node = null;
    @property(cc.Node)
    matchButton: cc.Node = null;


    onLoad() {

    }

    start() {
        AppFacade.getInstance().registerMediator(new MenuViewMediator(this));
    }

    public onDestroy() {
        AppFacade.getInstance().removeMediator(MenuViewMediator.NAME);
    }

    // 切换游戏模式
    public setModeType(modeType: number) {
        // let animation = this.getComponent(cc.Animation);
        // animation.play("mode");

        if (modeType == 2) {
            this.mode2Button.active = true;
            this.mode4Button.active = false;
        } else {
            this.mode2Button.active = false;
            this.mode4Button.active = true;
        }
    }
}

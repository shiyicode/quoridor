import { BaseUI } from "./BaseUI";
import { Tip } from "./Tip";
import { ProjectConfig } from "../../Constants";
import { UIManager } from "../../manager/UIManager";
import { AudioManager } from "../../manager/AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export class HelpView extends BaseUI {

    protected static NAME = "HelpView";

    static getUrl():string {
        return ProjectConfig.PREFAB_UI_DIR + HelpView.NAME;
    }

    @property(cc.Node)
    private leaveButton: cc.Node = null;

    onLoad() {
        this.leaveButton.on("click", () => {
            AudioManager.getInstance().playSound("touch");

            UIManager.getInstance().closeUI(HelpView);
        })
    }

}
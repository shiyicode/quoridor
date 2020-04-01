import { BaseUI } from "./BaseUI";
import { Tip } from "./Tip";
import { ProjectConfig } from "../../Constants";

const {ccclass, property} = cc._decorator;

@ccclass
export class TipView extends BaseUI {

    protected static NAME = "TipView";

    static getUrl():string {
        return ProjectConfig.PREFAB_UI_DIR + TipView.NAME;
    }

    @property(cc.Prefab)
    private tipPrefab: cc.Prefab = null;
    private tipPool: Tip[] = [];

    showTip(message: string)
    {
        for(let i = 0; i < this.tipPool.length; ++i)
        {
            if(this.tipPool[i] != null && this.tipPool[i].isReady())
            {
                this.tipPool[i].playTip(message);
                return;
            }
        }
        console.log("create tip", message);
        let TipNode = cc.instantiate(this.tipPrefab);
        TipNode.parent = this.node
        let tip = TipNode.getComponent(Tip);
        this.tipPool.push(tip);

        tip.playTip(message);

        // let sleep = cc.delayTime(0.5);
        // let callback = cc.callFunc(() => {
        // }, this);

        // let action = cc.sequence(sleep, callback);
        // this.node.runAction(action);
    }
}
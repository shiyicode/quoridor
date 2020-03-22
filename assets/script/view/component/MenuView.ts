import AppFacade from "../../AppFacade";
import MenuViewMediator from "../MenuViewMediator";
import Util from "../../util/Util";
import { ProjectConfig } from "../../Constants";
import { BaseUI } from "./BaseUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MenuView extends BaseUI {

    public static NAME = "MenuView";

    static getUrl():string {
        return ProjectConfig.PREFAB_UI_DIR + MenuView.NAME;
    }

    @property(cc.Node)
    popupLayer: cc.Node = null;

    @property(cc.Node)
    playerNode: cc.Node = null;

    @property(cc.Node)
    mode2Node: cc.Node = null;

    @property(cc.Node)
    mode4Node: cc.Node = null;

    @property(cc.Node)
    helpNode: cc.Node = null;


    onLoad() {
    }

    start() {
        // AppFacade.getInstance().registerMediator(new MenuViewMediator(this));
    }

    public onDestroy() {
        // AppFacade.getInstance().removeMediator(MenuViewMediator.NAME);
    }

    // 切换游戏模式
    public setModeType(modeType: number) {
        if (modeType == 2) {
            this.mode2Node.active = true;
            this.mode4Node.active = false;
        } else {
            this.mode2Node.active = false;
            this.mode4Node.active = true;
        }
    }

    // 展示用户信息
    public setUserInfo(avatarUrl: string, nickName: string) {
        let head = this.playerNode.getChildByName('mask').getChildByName('head')
        let headBG = head.getComponent(cc.Sprite);

        let name = this.playerNode.getChildByName('name').getComponent(cc.Label);

        if (avatarUrl) {
            cc.loader.load({
                url: avatarUrl,
                type: 'jpg'
            }, function (err, texture) {
                if (err == null) {
                    headBG.spriteFrame = new cc.SpriteFrame(texture);
                }
                head.active = true;
            });
        } else {
            head.active = false;
        }

        if (nickName) {
            nickName = Util.cutstr(nickName, 5);
            name.string = nickName;
        } else {
            name.string = "游客";
        }
    }

    // 在creator编辑器与按钮绑定，在mediator里实现
    mode2ButtonClick(event, data) { }

    mode4ButtonClick(event, data) { }

    team2ButtonClick(event, data) { }

    team4ButtonClick(event, data) { }

    match2ButtonClick(event, data) { }

    match4ButtonClick(event, data) {}

    machine2ButtonClick(event, data) { }

    machine4ButtonClick(event, data) { }

    shareButtonClick(event, data) { }

    helpButtonClick(event, data) { }

    rankButtonClick(event, data) { }

    helpNodeLeaveButton(event, data) {
        this.helpNode.active = false;
    }
}

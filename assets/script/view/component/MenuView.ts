import AppFacade from "../../AppFacade";
import MenuViewMediator from "../MenuViewMediator";
import Util from "../../util/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MenuView extends cc.Component {

    @property(cc.Node)
    playerNode: cc.Node = null;

    @property(cc.Node)
    mode2Node: cc.Node = null;

    @property(cc.Node)
    mode4Node: cc.Node = null;

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
        if (avatarUrl) {
            let head = this.playerNode.getChildByName('mask').getChildByName('head')
            let headBG = head.getComponent(cc.Sprite);

            head.active = true;

            cc.loader.load({
                url: avatarUrl,
                type: 'jpg'
            }, function (err, texture) {
                console.log("加载头像", err);
                if (err == null) {
                    headBG.spriteFrame = new cc.SpriteFrame(texture);
                }
            });
        }
        if (nickName) {
            nickName = Util.cutstr(nickName, 5);
            let name = this.playerNode.getChildByName('name').getComponent(cc.Label);
            name.string = nickName;
        }
    }

    // 在creator编辑器与按钮绑定，在mediator里实现
    mode2ButtonClick(event, data) { }

    mode4ButtonClick(event, data) { }

    team2ButtonClick(event, data) { }

    team4ButtonClick(event, data) { }

    match2ButtonClick(event, data) { }

    machine2ButtonClick(event, data) { }

}

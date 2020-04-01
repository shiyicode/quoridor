import Util from "../../util/Util";
import { PlayerStatus } from "../../Constants";

const { ccclass, property } = cc._decorator;

@ccclass
export class Player extends cc.Component {
    @property(cc.Label)
    nickNameNode: cc.Label = null;
    @property(cc.Node)
    headNode: cc.Node = null;
    @property(cc.Node)
    headWaitNode: cc.Node = null;
    @property(cc.Node)
    readyNode: cc.Node = null;
    @property(cc.Node)
    wallCntNode: cc.Node = null;
    @property(cc.Node)
    timeNode: cc.Node = null;
    @property(cc.Node)
    leaveNode: cc.Node = null;
    @property(cc.Node)
    offlineNode: cc.Node = null;


    setPlayer(nickName: string, avatarUrl: string) {
        let name = this.nickNameNode.getComponent(cc.Label);
        let headBG = this.headNode.getComponent(cc.Sprite);
        let head =  this.headNode;
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
            head.active = true;
        }

        if (nickName) {
            nickName = Util.cutstr(nickName, 5);
            name.string = nickName;
        } else {
            name.string = "";
        }
    }

    setWait(isWait: boolean) {
        this.headWaitNode.active = isWait;
    }

    setReady(isReady: boolean) {
        this.readyNode.active = isReady;
    }

    setWallNum(wallcnt: number) {
        let wallcntLabel = this.wallCntNode.getComponent(cc.Label);
        wallcntLabel.string = wallcnt.toString();
    }

    setTime(isShow: boolean, time: number) {
        this.timeNode.active = isShow;
        if (isShow) {
            let num = this.timeNode.getChildByName('num').getComponent(cc.Label);
            num.string = time.toString();
        }
    }

    setStatus(status: PlayerStatus) {
        if (status == PlayerStatus.DEFAULT) {
            this.leaveNode.active = false;
            this.offlineNode.active = false;
        } else if (status == PlayerStatus.LEAVE) {
            this.leaveNode.active = true;
            this.offlineNode.active = false;
        } else if (status == PlayerStatus.OFFLINE) {
            this.leaveNode.active = false;
            this.offlineNode.active = true;
        }
    }
}
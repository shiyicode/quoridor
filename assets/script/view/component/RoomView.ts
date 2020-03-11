import AppFacade from "../../AppFacade";
import RoomViewMediator from "../RoomViewMediator";
import { RoomVO } from "../../model/vo/RoomVO";
import Util from "../../util/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoomView extends cc.Component {

    @property(cc.Node)
    playersNode: cc.Node = null;

    @property(cc.Node)
    barNode: cc.Node = null;

    @property(cc.Button)
    readyButton: cc.Button = null;

    @property(cc.Button)
    cancelButton: cc.Button = null;

    start() {
        AppFacade.getInstance().registerMediator(new RoomViewMediator(this));
    }

    public onDestroy() {
        AppFacade.getInstance().removeMediator(RoomViewMediator.NAME);
    }

    update(dt) {

    }

    updateRoom(room: RoomVO) {
        console.log("更新房间界面");
        let playerNodeArray: Array<cc.Node> = [];
        let playerCnt = Util.getPlayerCntByType(room.gameType);
        if (playerCnt == 2) {
            playerNodeArray.push(this.playersNode.getChildByName("player0"));
            playerNodeArray.push(this.playersNode.getChildByName("player2"));
            this.playersNode.getChildByName("player1").active = false;
            this.playersNode.getChildByName("player3").active = false;
        } else {
            for (let i = 0; i < 4; i++) {
                let node = this.playersNode.getChildByName('player' + i.toString());
                playerNodeArray.push(node);
            }
        }

        for (let i = 0; i < playerCnt; i++) {
            if (room.playersInfo[i].playerID && room.playersInfo[i].playerID != "") {
                this.setPlayerInfo(playerNodeArray[i], room.playersInfo[i].avatarUrl,
                    room.playersInfo[i].nickName, room.playersInfo[i].isReady);
            }
        }
        if (room.playersInfo[0].isReady != undefined) {
            this.readyButton.node.active = !room.playersInfo[0].isReady;
            this.cancelButton.node.active = room.playersInfo[0].isReady;
        }
    }

    public setPlayerInfo(playerNode: cc.Node, avatarUrl: string, nickName: string, isReady: boolean) {
        let head = playerNode.getChildByName('mask').getChildByName('head')
        let headBG = head.getComponent(cc.Sprite);

        let name = playerNode.getChildByName('name').getComponent(cc.Label);

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
            name.string = "";
        }

        playerNode.getChildByName('ready_tag').active = isReady;
    }

    readyButtonClick(event, data) { }

    cancelButtonClick(event, data) { }

    inviteButtonClick(event, data) { }

    leaveButtonClick(event, data) { }

    chatButtonClick(event, data) { }
}

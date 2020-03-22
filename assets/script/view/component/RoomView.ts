import AppFacade from "../../AppFacade";
import RoomViewMediator from "../RoomViewMediator";
import { RoomVO } from "../../model/vo/RoomVO";
import Util from "../../util/Util";
import { GameType, RoomStatus } from "../../Constants";
import { Platform } from "../../services/platform/IPlatform";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoomView extends cc.Component {

    @property(cc.Node)
    playersNode: cc.Node = null;

    @property(cc.Node)
    teamBarNode: cc.Node = null;

    @property(cc.Node)
    matchBarNode: cc.Node = null;

    @property(cc.Button)
    readyButton: cc.Button = null;

    @property(cc.Button)
    cancelButton: cc.Button = null;

    @property(cc.Button)
    matchReadyButton: cc.Button = null;

    @property(cc.Button)
    matchCancelButton: cc.Button = null;

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

        this.setBar(room);

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
            if (room.playersInfo[i] && room.playersInfo[i].playerID && room.playersInfo[i].playerID != "") {
                let isReady = room.playersInfo[i].isReady;
                if(room.gameType == GameType.MATCH2 || room.gameType == GameType.MATCH4) {
                    isReady = false;
                }
                this.setPlayerInfo(playerNodeArray[i], room.playersInfo[i].avatarUrl,
                    room.playersInfo[i].nickName, isReady);
            }
        }
        if (room.playersInfo[0].isReady != undefined) {
            this.readyButton.node.active = !room.playersInfo[0].isReady;
            this.cancelButton.node.active = room.playersInfo[0].isReady;
        }
    }

    public setBar(room: RoomVO) {
        if (room.gameType == GameType.TEAM2 || room.gameType == GameType.TEAM4) {
            this.teamBarNode.active = true;
            this.matchBarNode.active = false;

        } else if (room.gameType == GameType.MATCH2 || room.gameType == GameType.MATCH4) {
            this.teamBarNode.active = false;
            this.matchBarNode.active = true;

            let ready_title = this.matchBarNode.getChildByName("ready_title");
            let cancel_title = this.matchBarNode.getChildByName("matching");
            if (room.status == RoomStatus.START) {
                this.matchCancelButton.node.active = true;
                cancel_title.active = true;
                this.matchReadyButton.node.active = false;
                ready_title.active = false;
            } else if (room.status == RoomStatus.WAIT) {
                this.matchCancelButton.node.active = false;
                cancel_title.active = false;
                this.matchReadyButton.node.active = true;
                ready_title.active = true;

            }
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

    matchReadyButtonClick(event, data) { }

    matchCancelButtonClick(event, data) { }

    readyButtonClick(event, data) { }

    cancelButtonClick(event, data) { }

    inviteButtonClick(event, data) { }

    leaveButtonClick(event, data) { }

    chatButtonClick(event, data) {
        Platform().showToast("聊天功能尚未开放，敬请期待！");
    }
}

import AppFacade from "../../AppFacade";
import RoomViewMediator from "../RoomViewMediator";
import { RoomVO } from "../../model/vo/RoomVO";
import Util from "../../util/Util";
import { GameType, RoomStatus, ProjectConfig } from "../../Constants";
import { Platform } from "../../services/platform/IPlatform";
import { BaseUI } from "./BaseUI";
import { Player } from "./Player";

const { ccclass, property } = cc._decorator;


@ccclass
export default class RoomView extends BaseUI {

    public static NAME = "RoomView";

    static getUrl(): string {
        return ProjectConfig.PREFAB_UI_DIR + RoomView.NAME;
    }

    @property(cc.Node)
    leaveButton: cc.Node = null;
    @property(cc.Node)
    helpButton: cc.Node = null;
    @property(cc.Node)
    matchCancelButton: cc.Node = null;
    @property(cc.Node)
    matchBeginButton: cc.Node = null;
    @property(cc.Node)
    matchBarNode: cc.Node = null;
    @property(cc.Node)
    player0Node: cc.Node = null;
    @property(cc.Node)
    player1Node: cc.Node = null;
    @property(cc.Node)
    player2Node: cc.Node = null;
    @property(cc.Node)
    player3Node: cc.Node = null;
    @property(cc.Node)
    teamInviteButton: cc.Node = null;
    @property(cc.Node)
    teamReadyButton: cc.Node = null;
    @property(cc.Node)
    teamUnreadyButton: cc.Node = null;

    start() {
        AppFacade.getInstance().registerMediator(new RoomViewMediator(this));
    }

    public onDestroy() {
        AppFacade.getInstance().removeMediator(RoomViewMediator.NAME);
    }

    updateRoom(room: RoomVO) {
        console.log("更新房间界面", room);

        let playerNodeArray: Array<cc.Node> = [];
        let playerCnt = Util.getPlayerCntByType(room.gameType);
        if (playerCnt == 2) {
            playerNodeArray.push(this.player0Node);
            playerNodeArray.push(this.player2Node);
            this.player1Node.active = false;
            this.player3Node.active = false;
        } else {
            playerNodeArray.push(this.player0Node);
            playerNodeArray.push(this.player1Node);
            playerNodeArray.push(this.player2Node);
            playerNodeArray.push(this.player3Node);
        }

        if (room.gameType == GameType.MATCH2 || room.gameType == GameType.MATCH4) {
            if (room.status == RoomStatus.MATCH_WILL) {
                this.matchBarNode.active = false;
                this.matchBeginButton.active = true;
            } else if (room.status == RoomStatus.MATCH_ING) {
                this.matchBarNode.active = true;
                this.matchBeginButton.active = false;
            } else if (room.status == RoomStatus.MATCH_SUCC) {
                this.matchBarNode.active = false;
                this.matchBeginButton.active = false;
            }
        } else if (room.gameType == GameType.TEAM2 || room.gameType == GameType.TEAM4) {
            this.teamReadyButton.active = !room.playersInfo[0].isReady;
            this.teamUnreadyButton.active = room.playersInfo[0].isReady;
            this.teamInviteButton.active = true;
        }

        for (let i = 0; i < playerCnt; i++) {
            let player = playerNodeArray[i].getComponent(Player);

            if (room.playersInfo[i]) {
                let isReady = false;
                if (room.gameType == GameType.TEAM2 || room.gameType == GameType.TEAM4) {
                    isReady = room.playersInfo[i].isReady;
                }
                player.setPlayer(room.playersInfo[i].nickName, room.playersInfo[i].avatarUrl);
                player.setWait(false);
                player.setReady(isReady);
            } else {
                player.setPlayer("", "");
                player.setWait(true);
                player.setReady(false);
            }
        }
    }

}

import AppFacade from "../../AppFacade";
import GameViewMediator from "../GameViewMediator";
import { GameVO, Position, WallVO } from "../../model/vo/GameVO";
import Util from "../../util/Util";
import { GameType, WallType } from "../../Constants";
import UserProxy from "../../model/UserProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameView extends cc.Component {

    @property(cc.Node)
    chessBoardLayer: cc.Node = null;

    @property(cc.Node)
    playersNode: cc.Node = null;

    @property(cc.Node)
    barNode: cc.Node = null;

    @property(cc.Node)
    boxButtonNode: cc.Node = null;

    onLoad() {
    }

    start() {
        AppFacade.getInstance().registerMediator(new GameViewMediator(this));
    }

    public onDestroy() {
        AppFacade.getInstance().removeMediator(GameViewMediator.NAME);
    }

    updateView(game: GameVO) {
        // 初始化棋盘
        this.chessBoardLayer.getComponent("ChessboardView").updateView(game);

        let playerCnt = Util.getPlayerCntByType(game.gameType);

        // 初始化用户信息节点
        let playerNodeArray: Array<cc.Node> = [];
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

        // 初始化用户信息
        for (let i = 0; i < playerCnt; i++) {
            if (game.playersInfo[i].playerID && game.playersInfo[i].playerID != "") {
                this.setPlayerInfo(playerNodeArray[i], game.playersInfo[i].avatarUrl,
                    game.playersInfo[i].nickName, game.playersInfo[i].wallLeftCnt);
            }
        }
    }

    public setPlayerInfo(playerNode: cc.Node, avatarUrl: string, nickName: string, wallLeftCnt: number) {
        let head = playerNode.getChildByName('mask').getChildByName('head')
        let headBG = head.getComponent(cc.Sprite);

        let name = playerNode.getChildByName('name').getComponent(cc.Label);
        let wallcnt = playerNode.getChildByName('wallcnt').getChildByName('num').getComponent(cc.Label);

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

        wallcnt.string = wallLeftCnt.toString();

        // playerNode.getChildByName('ready_tag').active = isReady;
    }


    helpButtonClick(event, data) { }

    leaveButtonClick(event, data) { }

    giveupButtonClick(event, data) { }

    chatButtonClick(event, data) { }

    menuButtonClick(event, data) {
        this.boxButtonNode.active = !this.boxButtonNode.active;
    }

}

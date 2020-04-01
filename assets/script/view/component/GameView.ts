import AppFacade from "../../AppFacade";
import GameViewMediator from "../GameViewMediator";
import { GameVO, Position, WallVO } from "../../model/vo/GameVO";
import Util from "../../util/Util";
import { GameType, WallType, PlayerStatus, ProjectConfig, GameStatus, GameNotification } from "../../Constants";
import UserProxy from "../../model/UserProxy";
import { Platform } from "../../services/platform/IPlatform";
import { BaseUI } from "./BaseUI";
import { Player } from "./Player";
import ChessBoard from "./Chessboard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameView extends BaseUI {

    public static NAME = "GameView";

    static getUrl(): string {
        return ProjectConfig.PREFAB_UI_DIR + GameView.NAME;
    }

    @property(cc.Node)
    menuNode: cc.Node = null;
    @property(cc.Node)
    menuButton: cc.Node = null;
    @property(cc.Node)
    leaveButton: cc.Node = null;
    @property(cc.Node)
    giveupButton: cc.Node = null;
    @property(cc.Node)
    helpButton: cc.Node = null;
    @property(cc.Node)
    player0Node: cc.Node = null;
    @property(cc.Node)
    player1Node: cc.Node = null;
    @property(cc.Node)
    player2Node: cc.Node = null;
    @property(cc.Node)
    player3Node: cc.Node = null;
    @property(cc.Node)
    chessBoardLayer: cc.Node = null;
    @property(cc.Node)
    backMenuButton: cc.Node = null;
    @property(cc.Node)
    continueButton: cc.Node = null;
    @property(cc.Node)
    barNode: cc.Node = null;
    @property(cc.Node)
    winTitle: cc.Node = null;
    @property(cc.Node)
    loseTitle: cc.Node = null;

    onLoad() {
    }

    start() {
        AppFacade.getInstance().registerMediator(new GameViewMediator(this));
    }

    public onDestroy() {
        AppFacade.getInstance().removeMediator(GameViewMediator.NAME);
    }

    updateView(game: GameVO) {
        // 初始化用户信息节点
        let playerNodeArray: Array<cc.Node> = [];
        let playerCnt = Util.getPlayerCntByType(game.gameType);
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

        this.unscheduleAllCallbacks();

        // 初始化棋盘
        this.chessBoardLayer.getComponent(ChessBoard).updateView(game);

        if (game.status == GameStatus.END) {
            console.log("游戏结束");
            this.barNode.active = true;
            if (game.playersInfo[0].result == 0) {
                this.loseTitle.active = true;
                this.winTitle.active = false;
            } else {
                this.loseTitle.active = false;
                this.winTitle.active = true;
            }
        } else {
            this.barNode.active = false;
        }

        // 初始化用户信息
        for (let i = 0; i < playerCnt; i++) {
            let player = playerNodeArray[i].getComponent(Player);

            if (game.playersInfo[i] && game.playersInfo[i].playerID != "") {
                player.setWallNum(game.playersInfo[i].wallLeftCnt);
                player.setPlayer(game.playersInfo[i].nickName, game.playersInfo[i].avatarUrl);
                player.setStatus(game.playersInfo[i].status);

                // 如果是当前玩家，需要显示时间
                if (game.status != GameStatus.END && game.nowPlayerID == game.playersInfo[i].playerID) {
                    let callback = () => {
                        let nowTime = Date.parse(new Date().toString());
                        let interval = Math.ceil((nowTime - game.nowActionStartTime) / 1000);
                        if (interval <= game.maxActionDuration) {
                            player.setTime(true, game.maxActionDuration - interval);
                        } else {
                            this.unschedule(callback);
                            this.timeoutCallback();
                        }
                    }
                    this.schedule(callback, 1, cc.macro.REPEAT_FOREVER, 0);
                } else {
                    player.setTime(false, 0);
                }
            }
        }
    }

    public timeoutCallback() { }
}

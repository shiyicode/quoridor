import AppFacade from "../../AppFacade";
import GameViewMediator from "../GameViewMediator";
import { GameVO, Position, WallVO } from "../../model/vo/GameVO";
import Util from "../../util/Util";
import { GameType, WallType, PlayerStatus } from "../../Constants";
import UserProxy from "../../model/UserProxy";
import { Platform } from "../../services/platform/IPlatform";

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
    helpNode: cc.Node = null;

    @property(cc.Node)
    boxButtonNode: cc.Node = null;

    @property(cc.AudioClip)
    chessAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    wallAudio: cc.AudioClip = null;

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

        this.unscheduleAllCallbacks();

        let isEnd = this.showResult(game);

        // 初始化用户信息
        for (let i = 0; i < playerCnt; i++) {
            if (game.playersInfo[i].playerID && game.playersInfo[i].playerID != "") {
                this.setPlayerInfo(playerNodeArray[i], game.playersInfo[i].avatarUrl,
                    game.playersInfo[i].nickName, game.playersInfo[i].wallLeftCnt);

                // 设置状态
                let leaveNode = playerNodeArray[i].getChildByName('mask').getChildByName('leave_shadow');
                let offlineNode = playerNodeArray[i].getChildByName('mask').getChildByName('offline_shadow');
                let giveupNode = playerNodeArray[i].getChildByName('mask').getChildByName('giveup_shadow');
                leaveNode.active = false;
                giveupNode.active = false;
                offlineNode.active = false;

                if (game.playersInfo[i].status == PlayerStatus.LEAVE) {
                    leaveNode.active = true;
                } else if (game.playersInfo[i].status == PlayerStatus.GIVEUP) {
                    giveupNode.active = true;
                } else if (game.playersInfo[i].status == PlayerStatus.OFFLINE) {
                    offlineNode.active = true;
                }

                if (!isEnd) {
                    // 设置计时器
                    let node = playerNodeArray[i].getChildByName('time');
                    let num = node.getChildByName('num').getComponent(cc.Label);
                    let callback = () => {
                        let nowTime = Date.parse(new Date().toString());
                        let interval = Math.ceil((nowTime - game.nowActionStartTime) / 1000);
                        if (interval <= game.maxActionDuration) {
                            num.string = (game.maxActionDuration - interval).toString();
                            node.active = true;
                        } else {
                            this.unschedule(callback);
                            // if (game.nowPlayerID == game.playersInfo[0].playerID) {
                            this.timeoutCallback();
                            // }
                        }
                    };

                    if (game.nowPlayerID == game.playersInfo[i].playerID) {
                        this.schedule(callback, 1, cc.macro.REPEAT_FOREVER, 0);
                    } else {
                        node.active = false;
                    }
                } else {
                    this.chessBoardLayer.getComponent("ChessboardView").stopView();
                }
            }
        }
    }

    public showResult(game: GameVO) {
        this.barNode.active = false;

        let playerMaxNum = Util.getPlayerCntByType(game.gameType);
        for (let i = 0; i < playerMaxNum; i++) {
            if (game.playersInfo[i].status == PlayerStatus.WIN) {
                let winNode = this.barNode.getChildByName("win_title");
                let loseNode = this.barNode.getChildByName("lose_title");

                winNode.active = i == 0;
                loseNode.active = i != 0;
                this.barNode.active = true;
                return true;
            }
        }
    }

    public timeoutCallback() { }

    public setTimeout(playerNode: cc.Node, startTime: number, duration: number) {
        let node = playerNode.getChildByName('time');
        let num = node.getChildByName('num').getComponent(cc.Label);
        let callback = () => {
            let nowTime = Date.parse(new Date().toString());
            let interval = Math.ceil((nowTime - startTime) / 1000);
            console.log(interval);
            if (interval <= duration) {
                num.string = (duration - interval).toString();
                node.active = true;
            } else {
                this.unschedule(callback);
            }
        };
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

    continueButtonClick(event, data) { }

    backButtonClick(event, data) { }

    helpButtonClick(event, data) { }

    leaveButtonClick(event, data) { }

    giveupButtonClick(event, data) { }

    chatButtonClick(event, data) {
        Platform().showToast("聊天功能尚未开放，敬请期待！");
    }

    menuButtonClick(event, data) {
        this.boxButtonNode.active = !this.boxButtonNode.active;
    }

    helpNodeLeaveButton(event, data) {
        this.helpNode.active = false;
    }
}

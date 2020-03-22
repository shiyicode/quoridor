import UserProxy from "../model/UserProxy";
import GameView from "../view/component/GameView";
import ChessBoardView from "./component/ChessboardView";
import { Position, WallVO } from "../model/vo/GameVO";
import { WallType, GameNotification, GameAction, PlayerStatus, Scene, GameType } from "../Constants";
import GameProxy from "../model/GameProxy";
import MgobeService from "../services/mgobe/MgobeService";
import RoomProxy from "../model/RoomProxy";
import { Platform } from "../services/platform/IPlatform";
import Util from "../util/Util";
import GameCommand from "../controller/GameCommand";

export default class GameViewMediator extends puremvc.Mediator implements puremvc.IMediator {
    public static NAME: string = "GameViewMediator";

    public constructor(viewComponent: any) {
        super(GameViewMediator.NAME, viewComponent);
    }

    public listNotificationInterests(): string[] {
        return [
            GameNotification.GAME_START,
            GameNotification.GAME_UPDATE,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const viewComponent = this.viewComponent as GameView;
        const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;

        const data = notification.getBody();
        switch (notification.getName()) {
            case GameNotification.GAME_START: {
                break;
            }
            case GameNotification.GAME_UPDATE: {
                let game = gameProxy.getGame();
                viewComponent.updateView(game);
                console.log("更新游戏界面", game);
                break;
            }
        }
    }

    public onRegister(): void {
        // 启动帧同步
        MgobeService.startFrameSync((event) => {
            if (event.code == MGOBE.ErrCode.EC_OK) {
                console.log("启动帧同步成功");
            } else {
                console.log("启动帧同步失败");
            }
        });
        this.listenGame();

        this.initView();
        this.initCallback();
    }

    public onRemove(): void {
        // 关闭帧同步
        MgobeService.stopFrameSync((event) => {
            if (event.code == MGOBE.ErrCode.EC_OK) {
                console.log("关闭帧同步成功");
            } else {
                console.log("关闭帧同步失败");
            }
        });
        this.removeListenGame();

    }

    public initView() {
        const viewComponent = this.viewComponent as GameView;
        const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;

        // 清理准备状态，避免返回房间场景后又重复进入游戏场景
        this.clearReadyState();

        let room = roomProxy.getRoom();
        gameProxy.createGame(room);

        // 获取房间信息，初始化界面
        let game = gameProxy.getGame();
        viewComponent.updateView(game);
        console.log("初始化游戏界面", game);
    }

    public clearReadyState() {
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        roomProxy.setReadyStatus(false);
        console.log("将用户重置为未准备状态");
    }

    public initCallback() {
        const viewComponent = this.viewComponent as GameView;
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;
        let chessBoardVC = viewComponent.chessBoardLayer.getComponent("ChessboardView") as ChessBoardView;

        viewComponent.timeoutCallback = () => {
            console.log("随机走子");
            let position = new Position(5, 5);
            gameProxy.moveChess(userProxy.getPlayerId(), position);
            cc.audioEngine.play(viewComponent.chessAudio, false, 1);

            let data = {
                playerId: userProxy.getPlayerId(),
                action: GameAction.MOVE_CHESS,
                position: position,
            }
            MgobeService.sendFrame(data);
        }

        chessBoardVC.moveWallCallback = (position: Position, wallType: WallType) => {
            console.log("moveWallCallback", position, wallType);
            // chessBoardVC.addWall(position, wallType);

            let gameCommand = new GameCommand();
            let isWallLegal = gameCommand.isWallLegal(new WallVO(wallType, position), userProxy.getPlayerId());

            if (isWallLegal) {
                cc.audioEngine.play(viewComponent.wallAudio, false, 1);
                gameProxy.addWall(userProxy.getPlayerId(), position, wallType);
                this.sendNotification(GameNotification.GAME_UPDATE);

                let data = {
                    playerId: userProxy.getPlayerId(),
                    action: GameAction.ADD_WALL,
                    position: position,
                    wallType: wallType,
                }
                MgobeService.sendFrame(data);
            } else {
                Platform().showToast("墙不可将任何棋子堵死");
            }
        };

        chessBoardVC.moveChessCallback = (position: Position) => {
            console.log("moveChessCallback", position);

            gameProxy.moveChess(userProxy.getPlayerId(), position);
            this.sendNotification(GameNotification.GAME_UPDATE);
            cc.audioEngine.play(viewComponent.chessAudio, false, 1);

            let data = {
                playerId: userProxy.getPlayerId(),
                action: GameAction.MOVE_CHESS,
                position: position,
            }
            MgobeService.sendFrame(data);
        };

        chessBoardVC.getAllHintPosition = () => {
            let game = gameProxy.getGame();
            let gameCommand = new GameCommand();
            let positions = gameCommand.getAllLocation(userProxy.getPlayerId(), game.playersInfo[0].chessPosition);

            return positions;
        };

        viewComponent.leaveButtonClick = (event) => {
            console.log("leave button click");
            viewComponent.boxButtonNode.active = false;
            Platform().showModal("提示", (isConfirm) => {
                if (isConfirm) {
                    let game = gameProxy.getGame();
                    if (game.playersInfo[0].status != PlayerStatus.GIVEUP) {
                        let data = {
                            playerId: userProxy.getPlayerId(),
                            action: GameAction.LEAVE,
                        };
                        MgobeService.sendFrame(data, (event) => {
                            if (event.code == MGOBE.ErrCode.EC_OK) {
                                roomProxy.leaveRoom();
                            } else {
                            }
                        });
                        cc.director.loadScene(Scene.MENU);
                    }
                    roomProxy.leaveRoom();
                    cc.director.loadScene(Scene.MENU);
                } else {
                }
            }, "对局尚未结束，确认离开？", true, "确认", "取消");
        };
        viewComponent.giveupButtonClick = (event) => {
            console.log("giveup button click");
            viewComponent.boxButtonNode.active = false;
            let data = {
                playerId: userProxy.getPlayerId(),
                action: GameAction.GIVEUP,
            };
            MgobeService.sendFrame(data, (event) => {
                if (event.code == MGOBE.ErrCode.EC_OK) {
                } else {
                    Platform().showToast("请求失败，请重试");
                }
            });
            viewComponent.boxButtonNode.active = false;
            this.sendNotification(GameNotification.GAME_UPDATE);
        };
        viewComponent.helpButtonClick = (event) => {
            console.log("help button click");
            viewComponent.helpNode.active = true;
            viewComponent.boxButtonNode.active = false;
        };
        viewComponent.continueButtonClick = (event) => {
            console.log("continue button click");
        };
        viewComponent.backButtonClick = (event) => {
            console.log("back button click");
        };
    }

    listenGame() {
        console.log("开启游戏监听");
        const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;

        MgobeService.room.onRecvFrame = (event) => {
            // console.log("帧广播接收", event);
            this.calcFrame(event.data.frame);
        };

        // SDK 房间内消息广播
        MgobeService.room.onRecvFromClient = (event) => {
            console.log("房间消息广播接收");
            // this.uiChat.appendMsg(event.data.msg, event.data.sendPlayerId === MGOBE.Player.id);
        }

        MgobeService.room.onChangePlayerNetworkState = (event) => {
            console.log("网络变化", event);
            if (event.data.networkState == MGOBE.ENUM.NetworkState.RELAY_OFFLINE) {
                console.log("离线", event);
                gameProxy.setPlayerStatus(event.data.changePlayerId, PlayerStatus.OFFLINE);
            } else if (event.data.networkState == MGOBE.ENUM.NetworkState.RELAY_ONLINE) {
                console.log("在线", event);
                gameProxy.setPlayerStatus(event.data.changePlayerId, PlayerStatus.START);
            }
            this.sendNotification(GameNotification.GAME_UPDATE);
        };

        MgobeService.room.onAutoRequestFrameError = (event) => {
            console.log("自动补帧失败", event.data.code);
            // 重试
            MgobeService.room.retryAutoRequestFrame();
        }
    }

    removeListenGame() {
        console.log("关闭游戏监听");
        MgobeService.room.onRecvFrame = null;
        MgobeService.room.onRecvFromClient = null;
        MgobeService.room.onChangePlayerNetworkState = null;
    }

    // 根据每一帧计算游戏逻辑
    calcFrame(frame: MGOBE.types.Frame) {
        const viewComponent = this.viewComponent as GameView;

        const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;
        let gameCommand = new GameCommand();

        if(gameProxy.isEnd()) {
            return;
        }

        if (frame.items && frame.items.length > 0) {
            frame.items.forEach(item => {
                console.log("收到帧消息", item);
                switch (item.data['action']) {
                    case GameAction.MOVE_CHESS: {
                        // TODO 判断玩家胜利
                        if (userProxy.getPlayerId() != item.data['playerId']) {
                            cc.audioEngine.play(viewComponent.chessAudio, false, 1);
                            let position = gameCommand.rotationChess(item.data['playerId'], userProxy.getPlayerId(),
                                item.data['position']);
                            gameProxy.moveChess(item.data['playerId'], position);
                        }
                        gameProxy.changeNowPlayer();
                        break;
                    }
                    case GameAction.ADD_WALL: {
                        if (userProxy.getPlayerId() != item.data['playerId']) {
                            cc.audioEngine.play(viewComponent.wallAudio, false, 1);
                            let wallInfo = gameCommand.rotationWall(item.data['playerId'], userProxy.getPlayerId(),
                                new WallVO(item.data['wallType'], item.data['position']));
                            gameProxy.addWall(item.data['playerId'], wallInfo.position, wallInfo.wallType);
                        }
                        gameProxy.changeNowPlayer();
                        break;
                    }
                    case GameAction.GIVEUP: {
                        let game = gameProxy.getGame();
                        gameProxy.setPlayerStatus(item.data['playerId'], PlayerStatus.GIVEUP);

                        let leaveNum = 0;
                        let playerMaxNum = Util.getPlayerCntByType(game.gameType);
                        for (let i = 0; i < playerMaxNum; i++) {
                            if (game.playersInfo[i].status == PlayerStatus.LEAVE || game.playersInfo[i].status == PlayerStatus.GIVEUP) {
                                leaveNum++;
                            }
                        }
                        if (leaveNum+1 >= playerMaxNum) {
                            console.log("仅剩一个玩家，游戏结束");
                            for(let i=0; i<playerMaxNum; i++) {
                                if(game.playersInfo[i].status == PlayerStatus.START) {
                                    let winPlayerId = game.playersInfo[i].playerID;
                                    gameProxy.setPlayerStatus(winPlayerId, PlayerStatus.WIN);
                                    break;
                                }
                            }
                        } else {
                            if (item.data['playerId'] == game.nowPlayerID) {
                                gameProxy.changeNowPlayer();
                            }
                        }
                        break;
                    }
                    case GameAction.LEAVE: {
                        let game = gameProxy.getGame();
                        gameProxy.setPlayerStatus(item.data['playerId'], PlayerStatus.LEAVE);
                    }
                }
            });
            gameProxy.pushFrame(frame);
            this.sendNotification(GameNotification.GAME_UPDATE);
        }
    }
}
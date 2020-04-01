import UserProxy from "../model/UserProxy";
import GameView from "../view/component/GameView";
import { Position, WallVO } from "../model/vo/GameVO";
import { WallType, GameNotification, GameAction, PlayerStatus, GameStatus, RoomStatus } from "../Constants";
import GameProxy from "../model/GameProxy";
import MgobeService from "../services/mgobe/MgobeService";
import RoomProxy from "../model/RoomProxy";
import { Platform } from "../services/platform/IPlatform";
import Util from "../util/Util";
import GameCommand, { WallLegalType } from "../controller/GameCommand";
import { UIManager } from "../manager/UIManager";
import MenuView from "./component/MenuView";
import { HelpView } from "./component/HelpView";
import ChessBoard from "./component/Chessboard";
import RoomView from "./component/RoomView";
import { AudioManager } from "../manager/AudioManager";

export default class GameViewMediator extends puremvc.Mediator implements puremvc.IMediator {
    public static NAME: string = "GameViewMediator";

    public constructor(viewComponent: any) {
        super(GameViewMediator.NAME, viewComponent);
    }

    public listNotificationInterests(): string[] {
        return [
            GameNotification.GAME_UPDATE,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const viewComponent = this.viewComponent as GameView;
        const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;

        const data = notification.getBody();
        switch (notification.getName()) {
            case GameNotification.GAME_UPDATE: {
                let game = gameProxy.getGame();
                viewComponent.updateView(game);
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
        if (game.status == GameStatus.END) {
            UIManager.getInstance().showTip("游戏已结束!");
            UIManager.getInstance().showUI(MenuView);
            UIManager.getInstance().closeUI(GameView);
            return;
        }
        viewComponent.updateView(game);
        console.log("初始化游戏界面", game);
    }

    public initCallback() {
        const viewComponent = this.viewComponent as GameView;
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;
        let chessBoardVC = viewComponent.chessBoardLayer.getComponent(ChessBoard) as ChessBoard;

        viewComponent.menuButton.on("click", () => {
            AudioManager.getInstance().playSound("touch");

            viewComponent.menuNode.active = !viewComponent.menuNode.active;
        });

        viewComponent.leaveButton.on("click", () => {
            console.log("leave button click");
            AudioManager.getInstance().playSound("touch");

            viewComponent.menuNode.active = false;
            let game = gameProxy.getGame();
            if (game.status != GameStatus.END) {

                Platform().showModal("提示", (isConfirm) => {
                    if (isConfirm) {
                        let data = {
                            playerId: userProxy.getPlayerId(),
                            action: GameAction.LEAVE,
                            time: Date.parse(new Date().toString()),
                        };
                        MgobeService.sendFrame(data, (event) => {
                            if (event.code == MGOBE.ErrCode.EC_OK) {
                                this.leaveRoom();
                            }
                            roomProxy.setRoomStatus(RoomStatus.DEFAULT);
                            UIManager.getInstance().showUI(MenuView);
                            UIManager.getInstance().closeUI(GameView);
                        });
                    }
                }, "对局尚未结束，确认离开？", true, "确认", "取消");
            } else {
                roomProxy.setRoomStatus(RoomStatus.DEFAULT);
                UIManager.getInstance().showUI(MenuView);
                UIManager.getInstance().closeUI(GameView);
            }
        });

        viewComponent.helpButton.on("click", () => {
            console.log("help button click");
            AudioManager.getInstance().playSound("touch");

            UIManager.getInstance().openUISync(HelpView, 0, () => {
            });
        });

        viewComponent.backMenuButton.on("click", () => {
            console.log("back menu button click");
            AudioManager.getInstance().playSound("touch");

            this.leaveRoom();
            roomProxy.setRoomStatus(RoomStatus.DEFAULT);
            UIManager.getInstance().showUI(MenuView);
            UIManager.getInstance().closeUI(GameView);
        });

        viewComponent.continueButton.on("click", () => {
            console.log("continue button click");
            AudioManager.getInstance().playSound("touch");
            let game = gameProxy.getGame();
            roomProxy.initRoom(game.gameType);
            UIManager.getInstance().openUISync(RoomView, 0, () => {
                UIManager.getInstance().closeUI(GameView);
            });
        });

        viewComponent.timeoutCallback = () => {
            console.log("随机走子");
            let game = gameProxy.getGame();
            if (game.nowPlayerID == game.playersInfo[0].playerID) {
                if (game.status != GameStatus.END) {
                    let gameCommand = new GameCommand();
                    let positions = gameCommand.getAllLocation(userProxy.getPlayerId(), game.playersInfo[0].chessPosition);
                    let i = 0;
                    if (positions.length > 1) {
                        i = Util.random(0, positions.length - 1);
                    }

                    gameProxy.moveChess(userProxy.getPlayerId(), positions[i]);
                    AudioManager.getInstance().playSound("chess");

                    let time = Date.parse(new Date().toString());
                    gameProxy.changeNowPlayer(time);

                    let data = {
                        playerId: userProxy.getPlayerId(),
                        action: GameAction.MOVE_CHESS,
                        position: positions[i],
                        time: time,
                    }
                    MgobeService.sendFrame(data);
                    viewComponent.chessBoardLayer.getComponent(ChessBoard).clearView();
                }
            } else {
                let playerCnt = Util.getPlayerCntByType(game.gameType);
                let idx = 0;
                for (let i = 0; i < playerCnt; i++) {
                    if (game.nowPlayerID == game.playersInfo[i].playerID) {
                        idx = i;
                        break;
                    }
                }
                if (game.playersInfo[idx].status == PlayerStatus.OFFLINE) {
                    for (let i = 1; i < playerCnt; i++) {
                        let new_idx = (idx + i) % playerCnt;
                        if (game.playersInfo[new_idx].playerID == game.playersInfo[0].playerID
                            && game.playersInfo[new_idx].status == PlayerStatus.DEFAULT) {
                            console.log("将离线玩家置为逃跑");
                            gameProxy.setPlayerStatus(game.playersInfo[idx].playerID, PlayerStatus.LEAVE);
                            let time = Date.parse(new Date().toString());
                            gameProxy.changeNowPlayer(time);
                            let data = {
                                playerId: game.playersInfo[idx].playerID,
                                action: GameAction.LEAVE,
                                time: time,
                            };
                            MgobeService.sendFrame(data);
                            this.sendNotification(GameNotification.GAME_UPDATE);
                            break;
                        }
                    }
                }
            }
        }

        chessBoardVC.moveWallCallback = (position: Position, wallType: WallType) => {
            console.log("moveWallCallback", position, wallType);
            AudioManager.getInstance().playSound("wall");

            let gameCommand = new GameCommand();
            let isWallLegal = gameCommand.isWallLegal(new WallVO(wallType, position), userProxy.getPlayerId());

            switch (isWallLegal) {
                case WallLegalType.RIGHT:
                    gameProxy.addWall(userProxy.getPlayerId(), position, wallType);
                    let time = Date.parse(new Date().toString());
                    gameProxy.changeNowPlayer(time);
                    this.sendNotification(GameNotification.GAME_UPDATE);

                    let data = {
                        playerId: userProxy.getPlayerId(),
                        action: GameAction.ADD_WALL,
                        position: position,
                        wallType: wallType,
                        time: time,
                    }
                    MgobeService.sendFrame(data);
                    break;
                case WallLegalType.NOT_HAVE:
                    UIManager.getInstance().showTip("木板放置失败，数量不足!");
                    break;
                case WallLegalType.OVER_LAP:
                    UIManager.getInstance().showTip("木板放置失败，不可重叠、交叉");
                    break;
                case WallLegalType.SEAL:
                    UIManager.getInstance().showTip("木板放置失败，不可将任何棋子堵死!");
                    break;
            }
            viewComponent.chessBoardLayer.getComponent(ChessBoard).clearView();
        };

        chessBoardVC.moveChessCallback = (position: Position) => {
            console.log("moveChessCallback", position);

            gameProxy.moveChess(userProxy.getPlayerId(), position);
            let time = Date.parse(new Date().toString());
            gameProxy.changeNowPlayer(time);
            this.sendNotification(GameNotification.GAME_UPDATE);
            AudioManager.getInstance().playSound("chess");

            let data = {
                playerId: userProxy.getPlayerId(),
                action: GameAction.MOVE_CHESS,
                position: position,
                time: time,
            }
            MgobeService.sendFrame(data);
            viewComponent.chessBoardLayer.getComponent(ChessBoard).clearView();
        };

        chessBoardVC.getAllHintPosition = () => {
            let game = gameProxy.getGame();
            let gameCommand = new GameCommand();
            let positions = gameCommand.getAllLocation(userProxy.getPlayerId(), game.playersInfo[0].chessPosition);

            return positions;
        };

        // viewComponent.giveupButton.on("click", () => {
        //     console.log("giveup button click");
        //     viewComponent.menuNode.active = false;
        //     // UIManager.getInstance().showUI(MenuView);
        //     // UIManager.getInstance().closeUI(GameView);
        // });

        // viewComponent.giveupButtonClick = (event) => {
        //     console.log("giveup button click");
        //     viewComponent.boxButtonNode.active = false;
        //     let data = {
        //         playerId: userProxy.getPlayerId(),
        //         action: GameAction.GIVEUP,
        //     };
        //     MgobeService.sendFrame(data, (event) => {
        //         if (event.code == MGOBE.ErrCode.EC_OK) {
        //         } else {
        //             Platform().showToast("请求失败，请重试");
        //         }
        //     });
        //     viewComponent.boxButtonNode.active = false;
        //     this.sendNotification(GameNotification.GAME_UPDATE);
        // };
    }

    listenGame() {
        console.log("开启游戏监听");
        const viewComponent = this.viewComponent as GameView;
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
                let game = gameProxy.getGame();
                if (game.nowPlayerID == event.data.changePlayerId) {
                    game.nowActionStartTime = Date.parse(new Date().toString());
                }
                gameProxy.setPlayerStatus(event.data.changePlayerId, PlayerStatus.OFFLINE);
            } else if (event.data.networkState == MGOBE.ENUM.NetworkState.RELAY_ONLINE) {
                console.log("在线", event);
                // TODO 重置  踢出去
                viewComponent.unscheduleAllCallbacks();
                gameProxy.setPlayerStatus(event.data.changePlayerId, PlayerStatus.DEFAULT);
            }
            // gameProxy.checkEnd();
            this.sendNotification(GameNotification.GAME_UPDATE);
        };

        MgobeService.room.onAutoRequestFrameError = (event) => {
            console.log("自动补帧失败", event.data.code);
            // 重试
            MgobeService.room.retryAutoRequestFrame();
        };
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

        if (frame.items && frame.items.length > 0) {
            frame.items.forEach(item => {
                console.log("收到帧消息", item);
                switch (item.data['action']) {
                    case GameAction.MOVE_CHESS: {

                        let position = gameCommand.rotationChess(item.data['playerId'], userProxy.getPlayerId(),
                            item.data['position']);
                        console.log("移动棋子", position);
                        if (userProxy.getPlayerId() != item.data['playerId']) {
                            AudioManager.getInstance().playSound("chess");
                            gameProxy.moveChess(item.data['playerId'], position);
                            gameProxy.changeNowPlayer(item.data['time']);
                        }

                        if (gameCommand.isUserEnd(item.data['playerId'], position)) {
                            console.log("user end", item.data['playerId']);
                            gameProxy.setPlayerResult(item.data['playerId'], gameProxy.getMaxPlayerResult() + 1);
                        }
                        gameProxy.checkEnd();
                        break;
                    }
                    case GameAction.ADD_WALL: {
                        if (userProxy.getPlayerId() != item.data['playerId']) {
                            AudioManager.getInstance().playSound("wall");
                            let wallInfo = gameCommand.rotationWall(item.data['playerId'], userProxy.getPlayerId(),
                                new WallVO(item.data['wallType'], item.data['position']));
                            gameProxy.addWall(item.data['playerId'], wallInfo.position, wallInfo.wallType);
                            gameProxy.changeNowPlayer(item.data['time']);
                        }
                        break;
                    }
                    case GameAction.LEAVE: {
                        let game = gameProxy.getGame();
                        gameProxy.setPlayerStatus(item.data['playerId'], PlayerStatus.LEAVE);
                        console.log("玩家离开");
                        gameProxy.checkEnd();
                        if (item.data['playerId'] == game.nowPlayerID) {
                            gameProxy.changeNowPlayer(item.data['time']);
                        }
                        break;
                    }
                }
            });
            let game = gameProxy.getGame();
            if(game.status == GameStatus.END) {
                this.removeListenGame();
            }
            gameProxy.pushFrame(frame);
            this.sendNotification(GameNotification.GAME_UPDATE);
        }
    }

    public leaveRoom() {
        MgobeService.getMyRoom((event) => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                MgobeService.leaveRoom((event) => {
                    if (event.code === MGOBE.ErrCode.EC_OK || event.code === MGOBE.ErrCode.EC_ROOM_PLAYER_NOT_IN_ROOM) {
                        console.log("离开房间成功", event);
                    } else {
                        console.log("离开房间失败", event);
                    }
                });
            } else {
                console.log("获取房间信息失败", event);
            }
        });
    }

    public clearReadyState() {
        MgobeService.changeCustomPlayerStatus(0, (event) => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
            } else {
                console.log("重置为未准备状态失败");
            }
        });
        console.log("将用户重置为未准备状态");
    }
}
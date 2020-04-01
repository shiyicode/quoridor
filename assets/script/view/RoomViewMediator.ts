import { RoomNotification, Scene, RoomStatus, GameType } from "../Constants";
import RoomView from "../view/component/RoomView";
import RoomProxy from "../model/RoomProxy";
import { Platform } from "../services/platform/IPlatform";
import MgobeService from "../services/mgobe/MgobeService";
import Util from "../util/Util";
import GameProxy from "../model/GameProxy";
import { UIManager } from "../manager/UIManager";
import { HelpView } from "./component/HelpView";
import MenuView from "./component/MenuView";
import GameView from "./component/GameView";
import { AudioManager } from "../manager/AudioManager";

export default class RoomViewMediator extends puremvc.Mediator implements puremvc.IMediator {
    public static NAME: string = "RoomViewMediator";

    public constructor(viewComponent: any) {
        super(RoomViewMediator.NAME, viewComponent);
    }

    public listNotificationInterests(): string[] {
        return [
            RoomNotification.ROOM_UPDATE,
            RoomNotification.ROOM_LEAVE,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        const viewComponent = this.viewComponent as RoomView;

        const data = notification.getBody();
        switch (notification.getName()) {
            case RoomNotification.ROOM_UPDATE: {
                let room = roomProxy.getRoom();
                viewComponent.updateRoom(room);
                break;
            }
            case RoomNotification.ROOM_LEAVE: {
                cc.director.loadScene(Scene.MENU);
                break;
            }
        }
    }

    public onRegister(): void {
        this.initView();
        this.initCallback();

        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        let room = roomProxy.getRoom();
        console.log("onRego", room);

        if (room.gameType == GameType.MATCH2 || room.gameType == GameType.MATCH4) {
            if (room.status == RoomStatus.MATCH_ING) {
                this.matchPlayers();
            }
        } else if (room.gameType == GameType.TEAM2 || room.gameType == GameType.TEAM4) {
            this.listenRoom();
        }
    }

    public onRemove(): void {
        this.removeListenRoom();
    }

    public initView() {
        const viewComponent = this.viewComponent as RoomView;
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;

        var anim = viewComponent.getComponent(cc.Animation);
        var animState = anim.play("match");

        // 获取房间信息，初始化界面
        let room = roomProxy.getRoom();
        viewComponent.updateRoom(room);
    }

    public initCallback() {
        const viewComponent = this.viewComponent as RoomView;
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;

        viewComponent.leaveButton.on("click", () => {
            console.log("leave button click");
            AudioManager.getInstance().playSound("touch");

            if(roomProxy.getRoom().status == RoomStatus.MATCH_ING) {
                this.cancelMatch();
            }
            this.leaveRoom();
            roomProxy.setRoomStatus(RoomStatus.DEFAULT);
            UIManager.getInstance().showUI(MenuView);
            UIManager.getInstance().closeUI(RoomView);
        });

        viewComponent.helpButton.on("click", () => {
            console.log("help button click");
            AudioManager.getInstance().playSound("touch");

            UIManager.getInstance().openUISync(HelpView, 0, () => {
            });
        });

        viewComponent.matchCancelButton.on("click", () => {
            console.log("match cancel button click");
            AudioManager.getInstance().playSound("touch");

            this.cancelMatch();
        });

        viewComponent.matchBeginButton.on("click", () => {
            console.log("match begin button click");
            AudioManager.getInstance().playSound("touch");

            this.matchPlayers();
        });

        viewComponent.teamReadyButton.on("click", () => {
            console.log("ready button click");
            AudioManager.getInstance().playSound("touch");

            MgobeService.changeCustomPlayerStatus(1, (event) => {
                if (event.code === MGOBE.ErrCode.EC_OK) {
                } else {
                    UIManager.getInstance().showTip("操作失败，请重试");
                }
            });
        });

        viewComponent.teamUnreadyButton.on("click", () => {
            console.log("unready button click");
            AudioManager.getInstance().playSound("touch");

            MgobeService.changeCustomPlayerStatus(0, (event) => {
                if (event.code === MGOBE.ErrCode.EC_OK) {
                } else {
                    UIManager.getInstance().showTip("操作失败，请重试");
                }
            });
        });

        viewComponent.teamInviteButton.on("click", () => {
            console.log("invite button click");
            AudioManager.getInstance().playSound("touch");

            let room = roomProxy.getRoom();
            console.log("好友组队邀请", "type=" + room.gameType + "&roomId=" + room.roomId);
            Platform().shareAppMessage(
                "房已开好，就差你了！",
                "https://mmocgame.qpic.cn/wechatgame/iaj0rRlwQUrJtbiaxIaZNhApCqNmKHeJHe06GuLX9qyTqRI9icaUiciaM3wyStPRIvn3v/0",
                "Eg-pgRbJSpyh-uGwnzdeZQ",
                "type=" + room.gameType + "&roomId=" + room.roomId,
            );
        });
    }

    public matchPlayers() {
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        roomProxy.setRoomStatus(RoomStatus.MATCH_ING);
        let room = roomProxy.getRoom();

        let callback = (event) => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("发起匹配成功", event);
                MgobeService.changeCustomPlayerStatus(1, (event) => {
                    if (event.code === MGOBE.ErrCode.EC_OK) {
                        roomProxy.setRoomStatus(RoomStatus.MATCH_SUCC);
                        roomProxy.setRoom(event.data.roomInfo);
                    } else {
                        UIManager.getInstance().showTip("匹配失败，请重试");
                    }
                });
                this.listenRoom();
            } else if (event.code == MGOBE.ErrCode.EC_MATCH_TIMEOUT) {
                console.log("匹配超时", event);
                roomProxy.setRoomStatus(RoomStatus.MATCH_WILL);
                UIManager.getInstance().showTip("匹配超时，请重试");
            } else if (event.code == MGOBE.ErrCode.EC_MATCH_PLAYER_IS_IN_MATCH) {
                console.log("已在匹配中", event);
                MgobeService.cancelMatch((event) => {
                    if (event.code === MGOBE.ErrCode.EC_OK) {
                        console.log("取消匹配成功", event);
                        this.matchPlayers();
                    } else {
                        console.log("取消匹配失败", event);
                        roomProxy.setRoomStatus(RoomStatus.MATCH_WILL);
                        UIManager.getInstance().showTip("匹配失败，请重试");
                    }
                });
                roomProxy.setRoomStatus(RoomStatus.MATCH_ING);
            } else if (event.code == MGOBE.ErrCode.EC_ROOM_PLAYER_ALREADY_IN_ROOM) {
                console.log("已在房间中，离开房间并重试", event);
                MgobeService.leaveRoom((event) => {
                    if (event.code === MGOBE.ErrCode.EC_OK || event.code === MGOBE.ErrCode.EC_ROOM_PLAYER_NOT_IN_ROOM) {
                        console.log("离开房间成功", event);
                        roomProxy.initRoom(room.gameType);
                        MgobeService.matchPlayers(room.playersInfo[0], Util.getPlayerCntByType(room.gameType),
                            room.gameType, callback);
                    } else {
                        console.log("离开房间失败", event);
                        roomProxy.setRoomStatus(RoomStatus.MATCH_WILL);
                        UIManager.getInstance().showTip("匹配失败，请重试");
                    }
                });
            } else {
                console.log("发起匹配失败", event);
                roomProxy.setRoomStatus(RoomStatus.MATCH_WILL);
                UIManager.getInstance().showTip("匹配失败，请重试");
            }
        };
        console.log("发起匹配", room);
        MgobeService.matchPlayers(room.playersInfo[0], Util.getPlayerCntByType(room.gameType),
            room.gameType, callback);
    }

    public cancelMatch() {
        console.log("取消匹配");
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;

        MgobeService.cancelMatch((event) => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("取消匹配成功", event);
                roomProxy.setRoomStatus(RoomStatus.MATCH_WILL);
            } else {
                console.log("取消匹配失败", event);
                UIManager.getInstance().showTip("取消匹配失败，请重试");
            }
        });
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

    public listenRoom() {
        console.log("启动room监听");
        const viewComponent = this.viewComponent as RoomView;
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;

        // 开启onUpdate监听
        MgobeService.room.onUpdate = (event) => {
            console.log("事件回调onUpdate", event.roomInfo);
            roomProxy.setRoom(event.roomInfo);
            let room = roomProxy.getRoom();

            if (roomProxy.isRoomReady()) {
                gameProxy.createGame(room);
                console.log("全部玩家已准备，前往Game场景");
                UIManager.getInstance().openUISync(GameView, 0, () => {
                    UIManager.getInstance().closeUI(RoomView);
                });
            }
        }


        MgobeService.room.onJoinRoom = (event) => {

        };

        MgobeService.room.onLeaveRoom = (event) => {

        };
    };


    public removeListenRoom() {
        console.log("关闭room监听");
        // 关闭onUpdate监听
        MgobeService.room.onUpdate = null;
    }
}
import { RoomNotification, Scene, WorldNotification, RoomStatus, GameType, RoomStartAction } from "../Constants";
import RoomView from "../view/component/RoomView";
import RoomProxy from "../model/RoomProxy";
import { Platform } from "../services/platform/IPlatform";
import MgobeService from "../services/mgobe/MgobeService";
import Util from "../util/Util";
import GameProxy from "../model/GameProxy";
import UserProxy from "../model/UserProxy";

export default class RoomViewMediator extends puremvc.Mediator implements puremvc.IMediator {
    public static NAME: string = "RoomViewMediator";
    public isJumpGame;

    public constructor(viewComponent: any) {
        super(RoomViewMediator.NAME, viewComponent);
        this.isJumpGame = false;
    }

    public listNotificationInterests(): string[] {
        return [
            RoomNotification.ROOM_UPDATE,
            RoomNotification.ROOM_LEAVE,
            WorldNotification.SHOW_TIPS,
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
            case WorldNotification.SHOW_TIPS: {
                Platform().hideLoading();
                Platform().showToast(data.title);
                break;
            }
        }
    }

    public onRegister(): void {
        this.initView();
        this.initCallback();

        this.listenRoom();

        this.runStartAction();
    }

    public onRemove(): void {
        this.removeListenRoom();
    }

    public initView() {
        const viewComponent = this.viewComponent as RoomView;
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;

        // 获取房间信息，初始化界面
        let room = roomProxy.getRoom();
        viewComponent.updateRoom(room);
        console.log("初始化房间界面", room);
    }

    public runStartAction() {
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;

        // 获取房间信息，初始化界面
        let room = roomProxy.getRoom();
        switch (room.startAction) {
            case RoomStartAction.MATCH: {
                roomProxy.matchPlayers();
            }
        }

        roomProxy.setRoomStartAction(RoomStartAction.DEFAULT);
    }

    public initCallback() {
        const viewComponent = this.viewComponent as RoomView;
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;

        viewComponent.readyButtonClick = (event, data) => {
            console.log("ready button click");
            roomProxy.setReadyStatus(true);
        };
        viewComponent.cancelButtonClick = (event, data) => {
            console.log("cancel button click");
            roomProxy.setReadyStatus(false);
        };
        viewComponent.matchReadyButtonClick = (event, data) => {
            console.log("match ready button click");
            roomProxy.setRoomStatus(RoomStatus.START);
            roomProxy.matchPlayers();
        };
        viewComponent.matchCancelButtonClick = (event, data) => {
            console.log("match cancel button click");
            roomProxy.cancelMatch();
        };
        viewComponent.leaveButtonClick = (event, data) => {
            console.log("leave button click");
            let room = roomProxy.getRoom();
            if (room.gameType == GameType.MATCH2 || room.gameType == GameType.MATCH4) {
                roomProxy.cancelMatch();
            }
            roomProxy.leaveRoom();
        };
        viewComponent.inviteButtonClick = (event, data) => {
            console.log("invite button click");
            let room = roomProxy.getRoom();
            console.log("好友组队邀请", "type=" + room.gameType + "&roomId=" + room.roomId);
            Platform().shareAppMessage(
                "房已开好，就差你了！",
                "Eg-pgRbJSpyh-uGwnzdeZQ",
                "type=" + room.gameType + "&roomId=" + room.roomId,
            );
        };
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

            if (!this.isJumpGame) {
                // 房间已经完成准备
                if (MgobeService.isStartFrameSync()) {
                    console.log("游戏已在进行中，前往Game场景");
                    cc.director.loadScene(Scene.GAME);
                } else if (roomProxy.isRoomReady()) {
                    gameProxy.createGame(room);
                    console.log("全部玩家已准备，前往Game场景");
                    cc.director.loadScene(Scene.GAME);
                }
                this.isJumpGame = true;
            }
            // switch (event.roomInfo.customProperties as RoomStatus) {
            //     case RoomStatus.WAIT: {
            // const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;
            // let playerID = userProxy.getPlayerId();
            // 如果是房主
            // if (event.roomInfo.owner == playerID) {
            //     // 如果所有玩家都准备好了
            //     if (event.roomInfo.playerList[0].customPlayerStatus == 1) {
            //         MgobeService.changeRoomStatus(RoomStatus.START);
            //         // this.startRoom();
            //     }
            // }
            // case RoomStatus.START: {
            // }
        }

        // if (!event.roomInfo.playerList.find(player => player.customPlayerStatus !== 1)) {
        // }

        // const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;
        // let playerID = userProxy.getPlayerId();
        // // 如果是房主
        // if (event.roomInfo.owner == playerID) {
        //     // 如果所有玩家都准备好了
        //     if (event.roomInfo.playerList[0].customPlayerStatus == 1) {
        //         MgobeService.changeRoomStatus(RoomStatus.START);
        //         this.startRoom();
        //     } else {
        //         MgobeService.changeRoomStatus(RoomStatus.WAIT);
        //     }
        // }

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
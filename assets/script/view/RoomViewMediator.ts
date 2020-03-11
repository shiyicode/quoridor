import { RoomNotification, Scene, WorldNotification } from "../Constants";
import RoomView from "../view/component/RoomView";
import RoomProxy from "../model/RoomProxy";
import { Platform } from "../services/platform/IPlatform";
import MgobeService from "../services/mgobe/MgobeService";
import Util from "../util/Util";
import GameProxy from "../model/GameProxy";

export default class RoomViewMediator extends puremvc.Mediator implements puremvc.IMediator {
    public static NAME: string = "RoomViewMediator";

    public constructor(viewComponent: any) {
        super(RoomViewMediator.NAME, viewComponent);
    }

    public listNotificationInterests(): string[] {
        return [
            RoomNotification.ROOM_UPDATE,
            RoomNotification.ROOM_LEAVE,
            RoomNotification.ROOM_START,
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
            case RoomNotification.ROOM_START: {
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
        this.listenRoom();

        this.initView();
        this.initCallback();

    }

    public onRemove(): void {
        this.removeListenRoom();
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
        viewComponent.leaveButtonClick = (event, data) => {
            console.log("leave button click");
            roomProxy.leaveRoom();
        };
        viewComponent.inviteButtonClick = (event, data) => {
            console.log("invite button click");
            let room = roomProxy.getRoom();
            console.log("好友组队邀请", "type=" + room.gameType + "&roomId=" + room.roomId);
            Platform().shareAppMessage(
                "房已开好，就差你了！",
                "",
                "type=" + room.gameType + "&roomId=" + room.roomId,
            );
        };
    }

    public initView() {
        const viewComponent = this.viewComponent as RoomView;
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;

        // 获取房间信息，初始化界面
        let room = roomProxy.getRoom();
        viewComponent.updateRoom(room);
        console.log("初始化房间界面", room);
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

            // 房间已经完成准备
            if(roomProxy.isRoomReady()) {
                gameProxy.createGame(room);
                cc.director.loadScene(Scene.GAME);
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
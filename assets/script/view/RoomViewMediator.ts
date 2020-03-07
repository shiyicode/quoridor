import { RoomNotification, Scene } from "../Constants";
import RoomView from "../view/component/RoomView";
import RoomProxy from "../model/RoomProxy";
import { Platform } from "../services/platform/IPlatform";

export default class RoomViewMediator extends puremvc.Mediator implements puremvc.IMediator {
    public static NAME: string = "RoomViewMediator";

    public constructor(viewComponent: any) {
        super(RoomViewMediator.NAME, viewComponent);
    }

    public listNotificationInterests(): string[] {
        return [
            RoomNotification.ROOM_UPDATE,
            RoomNotification.ROOM_LEAVE_SUCC,
            RoomNotification.ROOM_LEAVE_FAIL,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        const viewComponent = this.viewComponent as RoomView;

        const data = notification.getBody();
        switch (notification.getName()) {
            case RoomNotification.ROOM_UPDATE: {
                console.log("notify ====== room_update");
                let room = roomProxy.getRoom();
                viewComponent.updateRoom(room);
                break;
            }
            case RoomNotification.ROOM_LEAVE_SUCC: {
                cc.director.loadScene(Scene.MENU);
                break;
            }
            case RoomNotification.ROOM_LEAVE_FAIL: {
                break;
            }
        }
    }

    public onRegister(): void {
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        // 绑定监听必须放在首部
        roomProxy.listenRoom();

        this.initView();
        this.initCallback();

    }

    public onRemove(): void {
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        roomProxy.removeListenRoom();
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
            // this.facade.sendNotification(RoomNotification.ROOM_CANCEL);
        };
        viewComponent.inviteButtonClick = (event, data) => {
            console.log("invite button click");
            let room = roomProxy.getRoom();
            console.log("好友组队邀请", "type=" + room.gameType + "&roomId=" + room.roomId,);
            Platform().shareAppMessage(
                "房已开好，就差你了！",
                "",
                "type=" + room.gameType + "&roomId=" + room.roomId,
            );
        };



        // viewComponent.setModeType(userProxy.getModeType());

        // let userInfo = userProxy.getUserInfo();
        // viewComponent.setUserInfo(userInfo.avatarUrl, userInfo.nickName);

        // viewComponent.mode2Button.node.on('click', (event) => {
        //     viewComponent.setModeType(4);
        //     userProxy.setModeType(4);
        // });
        // viewComponent.mode4Button.node.on('click', (event) => {
        //     viewComponent.setModeType(2);
        //     userProxy.setModeType(2);
        // });
    }

    public initView() {
        const viewComponent = this.viewComponent as RoomView;
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;

        let room = roomProxy.getRoom();
        console.log("init view", room);
        viewComponent.updateRoom(room);
    }
}
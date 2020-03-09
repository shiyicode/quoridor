import { RoomNotification, GameType, Scene, WorldNotification } from "../Constants";
import UserProxy from "../model/UserProxy";
import MenuView from "../view/component/MenuView";
import RoomProxy from "../model/RoomProxy";
import { Platform } from "../services/platform/IPlatform";


export default class MenuViewMediator extends puremvc.Mediator implements puremvc.IMediator {
    public static NAME: string = "MenuViewMediator";

    public constructor(viewComponent: any) {
        super(MenuViewMediator.NAME, viewComponent);
    }

    public listNotificationInterests(): string[] {
        return [
            RoomNotification.ROOM_CREATE_SUCC,
            RoomNotification.ROOM_CREATE_FAIL,
            RoomNotification.ROOM_JOIN_SUCC,
            RoomNotification.ROOM_JOIN_FAIL,
            RoomNotification.ROOM_RETURN_CHECK,
            RoomNotification.ROOM_RETURN_NOT_CHECK,
            WorldNotification.ACTION_LAUNCH,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        const data = notification.getBody();
        switch (notification.getName()) {
            case RoomNotification.ROOM_CREATE_SUCC:
                Platform().hideLoading();
                cc.director.loadScene(Scene.ROOM);
                break;
            case RoomNotification.ROOM_CREATE_FAIL:
                Platform().hideLoading();
                Platform().showToast("创建房间失败");
                break;
            case RoomNotification.ROOM_JOIN_SUCC:
                Platform().hideLoading();
                cc.director.loadScene(Scene.ROOM);
                break;
            case RoomNotification.ROOM_JOIN_FAIL:
                Platform().hideLoading();
                Platform().showToast("加入房间失败");
                break;
            case RoomNotification.ROOM_RETURN_CHECK: {
                Platform().hideLoading();
                Platform().showModal("提示", (isConfirm) => {
                    if(isConfirm) {
                        console.log("进入已进行中的游戏");
                        cc.director.loadScene(Scene.ROOM);
                    } else {
                        console.log("忽略已进行中的游戏");
                        roomProxy.leaveRoom();
                    }
                }, "检测到您有对局尚未结束，是否跳转？", true, "确认", "取消");
                break;
            }
            case RoomNotification.ROOM_RETURN_NOT_CHECK: {}
            case WorldNotification.ACTION_LAUNCH: {
                Platform().hideLoading();
                this.actionByLaunchQuery();
                break;
            }
        }
    }

    public onRegister(): void {
        this.initView();
        this.initCallback();

        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        roomProxy.returnRoom();
        Platform().showLoading();
    }

    public onRemove(): void {
    }

    public initCallback() {
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;
        const viewComponent = this.viewComponent as MenuView;

        // 设置控件回调
        viewComponent.mode2ButtonClick = (event, data) => {
            console.log("mode2 button click");

            viewComponent.setModeType(4);
            userProxy.setModeType(4);
        };

        viewComponent.mode4ButtonClick = (event, data) => {
            console.log("mode4 button click");

            viewComponent.setModeType(2);
            userProxy.setModeType(2);
        };

        // TODO 后续多个游戏模式若耦合过多，可以整合为一个callback
        viewComponent.team2ButtonClick = (event, data) => {
            console.log("team2 button click");
            roomProxy.createRoom(GameType.TEAM2);
            Platform().showLoading();
        };

        viewComponent.team4ButtonClick = (event, data) => {
            console.log("team4 button click");
            roomProxy.createRoom(GameType.TEAM4);
            Platform().showLoading();
        };

        viewComponent.match2ButtonClick = (event, data) => {
            console.log("match2 button click");
            // this.facade.sendNotification(RoomNotification.ROOM_CREATE, { gameType: GameType.MATCH2 });
        };
    }

    public initView() {
        const viewComponent = this.viewComponent as MenuView;
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;

        viewComponent.setModeType(userProxy.getModeType());

        let userInfo = userProxy.getUserInfo();
        viewComponent.setUserInfo(userInfo.avatarUrl, userInfo.nickName);
    }

    actionByLaunchQuery() {
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;

        let launch = userProxy.getLaunch();
        userProxy.setLaunch({});

        console.log("执行获取参数", launch);
        if ((launch && launch.query && launch.scene) && (launch.scene == 1007 || launch.scene == 1008)) {
            switch (launch.query.type as GameType) {
                case GameType.TEAM2: {
                    const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
                    Platform().showLoading();
                    roomProxy.joinRoom(launch.query.roomId);
                    break;
                }
                default: {

                }
            }
        }
    }
}
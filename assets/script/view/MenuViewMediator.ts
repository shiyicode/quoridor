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
        const data = notification.getBody();
        switch (notification.getName()) {
            case RoomNotification.ROOM_CREATE_SUCC:
                cc.director.loadScene(Scene.ROOM);
                break;
            case RoomNotification.ROOM_CREATE_FAIL:
                break;
            case RoomNotification.ROOM_JOIN_SUCC:
                cc.director.loadScene(Scene.ROOM);
                break;
            case RoomNotification.ROOM_JOIN_FAIL:
                break;
            case RoomNotification.ROOM_RETURN_CHECK: {
                // TODO 对已在房间的玩家弹选择框
                console.log("进入已进行中的游戏场景");
                cc.director.loadScene(Scene.ROOM);
                break;
            }
            case RoomNotification.ROOM_RETURN_NOT_CHECK: {}
            case WorldNotification.ACTION_LAUNCH: {
                this.actionByLaunchQuery();
                break;
            }
            case RoomNotification.ROOM_RETURN_AGREE: {
                break;
            }
            case RoomNotification.ROOM_RETURN_DISAGREE: {
                break;
            }
        }
    }

    public onRegister(): void {
        this.initView();
        this.initCallback();

        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        roomProxy.returnRoom();
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
        };

        viewComponent.team4ButtonClick = (event, data) => {
            console.log("team4 button click");
            roomProxy.createRoom(GameType.TEAM4);
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
                    roomProxy.joinRoom(launch.query.roomId);
                    break;
                }
                default: {

                }
            }
        }
    }

}
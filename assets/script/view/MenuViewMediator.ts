import { RoomNotification, GameType, Scene, WorldNotification, RoomStartAction } from "../Constants";
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
            RoomNotification.ROOM_CREATE,
            RoomNotification.ROOM_JOIN,
            RoomNotification.ROOM_MATCH,
            RoomNotification.ROOM_RETURN_CHECK,
            RoomNotification.ROOM_RETURN_NOT_CHECK,
            WorldNotification.SHOW_TIPS,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        const data = notification.getBody();
        switch (notification.getName()) {
            case RoomNotification.ROOM_CREATE:
                Platform().hideLoading();
                cc.director.loadScene(Scene.ROOM);
                break;
            case RoomNotification.ROOM_JOIN:
                Platform().hideLoading();
                cc.director.loadScene(Scene.ROOM);
                break;
            case RoomNotification.ROOM_MATCH:
                Platform().hideLoading();
                cc.director.loadScene(Scene.ROOM);
                break;
            case RoomNotification.ROOM_RETURN_CHECK: {
                Platform().hideLoading();
                Platform().showModal("提示", (isConfirm) => {
                    if(isConfirm) {
                        console.log("进入已进行中的游戏");
                        // cc.director.loadScene(Scene.GAME);
                    } else {
                        console.log("忽略已进行中的游戏");
                        roomProxy.leaveRoom();
                    }
                }, "检测到您有对局尚未结束，是否跳转？", true, "确认", "取消");
                break;
            }
            case RoomNotification.ROOM_RETURN_NOT_CHECK: {
                Platform().hideLoading();
                this.actionByLaunchQuery();
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

        // const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        // roomProxy.returnRoom();
        // // TODO
        // Platform().showLoading();
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
            roomProxy.initRoom(GameType.MATCH2, RoomStartAction.MATCH);
            cc.director.loadScene(Scene.ROOM);
        };

        viewComponent.match4ButtonClick = (event, data) => {
            console.log("match4 button click");
            roomProxy.initRoom(GameType.MATCH4, RoomStartAction.MATCH);
            cc.director.loadScene(Scene.ROOM);
            // this.facade.sendNotification(RoomNotification.ROOM_CREATE, { gameType: GameType.MATCH2 });
        };

        viewComponent.machine2ButtonClick = (event, data) => {
            console.log("machine2 button click");
            Platform().showToast("敬请期待！");
        };

        viewComponent.machine4ButtonClick = (event, data) => {
            console.log("machine4 button click");
            Platform().showToast("敬请期待！");
        };

        viewComponent.shareButtonClick = () => {
            Platform().shareAppMessage(
                "墙棋，欧美最风行的棋类游戏，一起来玩吧！",
                "Eg-pgRbJSpyh-uGwnzdeZQ",
                "",
            );
        }

        viewComponent.helpButtonClick = () => {
            viewComponent.helpNode.active = true;
        }
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
                    console.log("加入房间", launch.query);
                    roomProxy.initRoom(GameType.TEAM2, RoomStartAction.DEFAULT);
                    roomProxy.joinRoom(launch.query.roomId);
                    break;
                }
                case GameType.TEAM4: {
                    const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
                    Platform().showLoading();
                    console.log("加入房间", launch.query);
                    roomProxy.initRoom(GameType.TEAM4, RoomStartAction.DEFAULT);
                    roomProxy.joinRoom(launch.query.roomId);
                    break;
                }
                default: {

                }
            }
        }
    }
}
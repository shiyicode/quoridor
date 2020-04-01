import { GameType, WorldNotification, RoomStatus } from "../Constants";
import UserProxy from "../model/UserProxy";
import MenuView from "../view/component/MenuView";
import RoomProxy from "../model/RoomProxy";
import { Player } from "./component/Player";
import { UIManager } from "../manager/UIManager";
import { HelpView } from "./component/HelpView";
import RoomView from "./component/RoomView";
import MgobeService from "../services/mgobe/MgobeService";
import Util from "../util/Util";
import { AudioManager } from "../manager/AudioManager";
import GameView from "./component/GameView";


export default class MenuViewMediator extends puremvc.Mediator implements puremvc.IMediator {
    public static NAME: string = "MenuViewMediator";

    public constructor(viewComponent: any) {
        super(MenuViewMediator.NAME, viewComponent);
    }

    public listNotificationInterests(): string[] {
        return [
            WorldNotification.RUN_LAUNCH,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const data = notification.getBody();
        switch (notification.getName()) {
            case WorldNotification.RUN_LAUNCH: {
                this.actionByLaunchQuery();
                break;
            }
        }
    }

    public onRegister(): void {
        this.initView();
        this.initCallback();

        this.actionByLaunchQuery();
    }

    public onRemove(): void {
    }


    public initView() {
        const viewComponent = this.viewComponent as MenuView;
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;

        // viewComponent.setModeType(userProxy.getModeType());
        let userInfo = userProxy.getUserInfo();

        let player = viewComponent.playerNode.getComponent(Player);
        player.setPlayer(userInfo.nickName, userInfo.avatarUrl);
    }

    public playerGame() {

    }

    public initCallback() {
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;
        const viewComponent = this.viewComponent as MenuView;

        viewComponent.matchButton.on("click", () => {
            console.log("match button click");
            AudioManager.getInstance().playSound("touch");
            let gameType = ("match" + userProxy.getModeType().toString()) as GameType;
            UIManager.getInstance().openUISync(RoomView, 0, () => {
                roomProxy.initRoom(gameType);
                UIManager.getInstance().hideUI(MenuView);
            });
        });

        viewComponent.teamButton.on("click", () => {
            console.log("team button click");
            AudioManager.getInstance().playSound("touch");

            let gameType = ("team" + userProxy.getModeType().toString()) as GameType;
            this.createRoom(gameType);
        });

        viewComponent.machineButton.on("click", () => {
            console.log("machine button click");
            AudioManager.getInstance().playSound("touch");

            UIManager.getInstance().showTip("暂未开放，敬请期待!");
        });

        viewComponent.helpButton.on("click", () => {
            console.log("help button click");
            AudioManager.getInstance().playSound("touch");

            UIManager.getInstance().openUISync(HelpView, 0, () => {
            });
        });

        viewComponent.rankButton.on("click", () => {
            console.log("rank button click");
            AudioManager.getInstance().playSound("touch");

            UIManager.getInstance().showTip("暂未开放，敬请期待!");
        });

        viewComponent.mode2Button.on("click", () => {
            console.log("mode2 button click");
            AudioManager.getInstance().playSound("touch");
            UIManager.getInstance().showTip("暂未开放，敬请期待!");

            // userProxy.setModeType(4);
            // viewComponent.setModeType(4);
        });

        viewComponent.mode4Button.on("click", () => {
            console.log("mode4 button click");
            AudioManager.getInstance().playSound("touch");

            viewComponent.setModeType(2);
            userProxy.setModeType(2);
        });
    }

    public createRoom(gameType: GameType) {
        UIManager.getInstance().showLoadingSync(true);
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        console.log("创建组队房间");

        roomProxy.initRoom(gameType);
        let room = roomProxy.getRoom();

        MgobeService.createRoom(room.playersInfo[0], Util.getPlayerCntByType(gameType), gameType, (event) => {

            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("创建房间成功", event);
                roomProxy.setRoom(event.data.roomInfo);
                UIManager.getInstance().openUISync(RoomView, 0, () => {
                    UIManager.getInstance().hideLoading();
                    UIManager.getInstance().hideUI(MenuView);
                });
            } else {
                if (event.code == MGOBE.ErrCode.EC_ROOM_PLAYER_ALREADY_IN_ROOM) {
                    MgobeService.leaveRoom((event) => {
                        if (event.code === MGOBE.ErrCode.EC_OK || event.code === MGOBE.ErrCode.EC_ROOM_PLAYER_NOT_IN_ROOM) {
                            console.log("离开房间成功", event);
                            this.createRoom(gameType);
                        } else {
                            console.log("离开房间失败", event);
                            UIManager.getInstance().hideLoading();
                            UIManager.getInstance().showTip("创建房间失败，请重试");
                        }
                    });
                } else {
                    console.log("创建房间失败", event);
                    UIManager.getInstance().hideLoading();
                    UIManager.getInstance().showTip("创建房间失败，请重试");
                }
            }
        });
    }


    public joinRoom(gameType: GameType, roomId: string) {
        UIManager.getInstance().showLoadingSync(true);
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        console.log("加入组队房间");

        roomProxy.initRoom(gameType);
        let room = roomProxy.getRoom();

        MgobeService.joinRoom(roomId, room.playersInfo[0], (event) => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("加入房间成功", event);
                roomProxy.setRoom(event.data.roomInfo);
                UIManager.getInstance().openUISync(RoomView, 0, () => {
                    UIManager.getInstance().hideLoading();
                    UIManager.getInstance().hideUI(MenuView);
                });
            } else if (event.code == MGOBE.ErrCode.EC_ROOM_PLAYER_ALREADY_IN_ROOM) {
                MgobeService.leaveRoom((event) => {
                    if (event.code === MGOBE.ErrCode.EC_OK || event.code === MGOBE.ErrCode.EC_ROOM_PLAYER_NOT_IN_ROOM) {
                        console.log("离开房间成功", event);
                        this.joinRoom(gameType, roomId);
                    } else {
                        console.log("离开房间失败", event);
                        UIManager.getInstance().hideLoading();
                        UIManager.getInstance().showTip("加入房间失败，请重试");
                    }
                });
            } else if (event.code == MGOBE.ErrCode.EC_ROOM_INFO_UNEXIST) {
                console.log("房间不存在", event);
                UIManager.getInstance().hideLoading();
                UIManager.getInstance().showTip("加入房间失败，房间不存在");
            } else {
                console.log("加入房间失败", event);
                UIManager.getInstance().hideLoading();
                UIManager.getInstance().showTip("加入房间失败，请重试");
            }
        });
    }

    actionByLaunchQuery() {
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;

        let launch = userProxy.getLaunch();
        // 重置launch
        userProxy.setLaunch({});

        console.log("重置launch", userProxy.getLaunch());

        console.log("执行获取参数", launch);
        if ((launch && launch.query && launch.scene) && (launch.scene == 1007 || launch.scene == 1008)) {
            if (launch.query.type) {
                let room = roomProxy.getRoom();
                if (room && room.status) {
                    if (room.status == RoomStatus.GAME_ING
                        || room.status == RoomStatus.MATCH_ING
                        || room.status == RoomStatus.MATCH_SUCC) {
                        console.log("忽略执行获取参数", room.status);
                        return;
                    } else if (room.status == RoomStatus.GAME_END) {
                        UIManager.getInstance().closeUI(GameView);
                        UIManager.getInstance().showUI(MenuView);
                    } else if (room.status == RoomStatus.TEAM) {
                        UIManager.getInstance().closeUI(RoomView);
                        UIManager.getInstance().showUI(MenuView);
                    } else if(room.status == RoomStatus.MATCH_WILL) {
                        UIManager.getInstance().closeUI(RoomView);
                        UIManager.getInstance().showUI(MenuView);
                    }
                }

                let gameType = launch.query.type as GameType;
                console.log("加入房间", launch.query);
                this.joinRoom(gameType, launch.query.roomId);
            }
        }
    }
}
import { RoomVO, PlayerVO } from "./vo/RoomVO";
import { RoomNotification, GameType } from "../Constants";
import Util from "../util/Util";
import UserProxy from "./UserProxy";

// 只需要在使用 MGOBE 之前 import 一次该文件
import "../library/mgobe/MGOBE.js";
import MgobeService from "../services/mgobe/MgobeService";


// 直接使用 MGOBE
const { Room, Listener, ErrCode, ENUM, DebuggerLog } = MGOBE;

export default class RoomProxy extends puremvc.Proxy implements puremvc.IProxy {
    public static NAME: string = "RoomProxy";
    private static instance: RoomProxy = null;
    private room: RoomVO = null;

    public static getInstance() {
        if (!this.instance) {
            this.instance = new RoomProxy();
        }
        return this.instance;
    }

    public constructor() {
        super(RoomProxy.NAME);
        this.room = new RoomVO();
    }

    // 判断是否已在房间内
    public returnRoom() {
        MgobeService.getMyRoom((event) => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("玩家已在房间中", event);
                // 如果房间有进行中的游戏，才返回
                this.setRoom(event.data.roomInfo);
                this.listenRoom();
                this.facade.sendNotification(RoomNotification.ROOM_RETURN_CHECK);
            } else {
                console.log("玩家不在房间中");
                this.facade.sendNotification(RoomNotification.ROOM_RETURN_NOT_CHECK);
            }
        });
    }

    public joinRoom(roomId: string) {
        console.log("加入房间");
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;

        let userInfo = userProxy.getUserInfo();
        let player = new PlayerVO();
        player.avatarUrl = userInfo.avatarUrl;
        player.nickName = userInfo.nickName;
        player.isReady = false;

        MgobeService.joinRoom(roomId, player, (event) => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("加入房间成功", event);
                this.setRoom(event.data.roomInfo);
                this.listenRoom();
                this.facade.sendNotification(RoomNotification.ROOM_JOIN_SUCC);
            } else {
                console.log("加入房间失败", event);
                this.facade.sendNotification(RoomNotification.ROOM_JOIN_FAIL);
            }
        });
    }

    public createRoom(gameType: GameType) {
        console.log("创建房间");
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;

        let userInfo = userProxy.getUserInfo();
        let player = new PlayerVO();
        player.avatarUrl = userInfo.avatarUrl;
        player.nickName = userInfo.nickName;
        player.isReady = false;

        MgobeService.createRoom(player, Util.getPlayerCntByType(gameType), gameType, (event) => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("创建房间成功", event);
                this.setRoom(event.data.roomInfo);
                this.listenRoom();
                this.facade.sendNotification(RoomNotification.ROOM_CREATE_SUCC);
            } else {
                console.log("创建房间失败", event);
                this.facade.sendNotification(RoomNotification.ROOM_CREATE_FAIL);
            }
        });
    }

    // TODO 断线时不应该离开房间，  重回游戏时，如果在游戏中，应提示是否返回游戏
    public leaveRoom() {
        MgobeService.leaveRoom((event) => {
            if (event.code === MGOBE.ErrCode.EC_OK || event.code === MGOBE.ErrCode.EC_ROOM_PLAYER_NOT_IN_ROOM) {
                this.facade.sendNotification(RoomNotification.ROOM_LEAVE_SUCC);
            } else {
                this.facade.sendNotification(RoomNotification.ROOM_LEAVE_FAIL);
            }
        });
    }

    public setReadyStatus(hasReady: boolean) {
        MgobeService.changeCustomPlayerStatus(hasReady ? 1 : 0, (event) => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
            } else {
                console.log("弹窗，提醒用户重试");
            }
        });
    }

    public getRoom(): RoomVO {
        return this.room;
    }

    public setRoom(roomInfo: MGOBE.types.RoomInfo) {
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;

        this.room.gameType = roomInfo.type as GameType;
        this.room.roomId = roomInfo.id;

        let meIdx = 0;
        let playerList = roomInfo.playerList;
        for (let i = 0; i < playerList.length; i++) {
            if (playerList[i].id == userProxy.getPlayerId()) {
                meIdx = i;
                break;
            }
        }

        for (let i = 0; i < playerList.length; i++) {
            let new_i = (i + meIdx) % playerList.length;
            this.room.playersInfo[i].playerID = playerList[new_i].id;
            this.room.playersInfo[i].avatarUrl = playerList[new_i].customProfile;
            this.room.playersInfo[i].nickName = playerList[new_i].name;
            this.room.playersInfo[i].isReady = playerList[new_i].customPlayerStatus == 1;
        }
    }

    public listenRoom() {
        console.log("启动room监听");
        // 开启onUpdate监听
        MgobeService.room.onUpdate = (event) => {
            console.log("事件回调onUpdate", event.roomInfo);
            this.setRoom(event.roomInfo);
            if (!event.roomInfo.playerList.find(player => player.customPlayerStatus !== 1)) {
                // TODO 全部玩家准备好就跳转Game
            }
            this.facade.sendNotification(RoomNotification.ROOM_UPDATE);
        };

        MgobeService.room.onJoinRoom = (event) => {

        };

        MgobeService.room.onLeaveRoom = (event) => {

        };
    }

    public removeListenRoom() {
        console.log("关闭room监听");
        // 关闭onUpdate监听
        MgobeService.room.onUpdate = null;
    }
}
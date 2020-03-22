import { RoomVO } from "./vo/RoomVO";
import { RoomNotification, GameType, RoomStatus, WorldNotification, PlayerStatus, RoomStartAction } from "../Constants";
import Util from "../util/Util";
import UserProxy from "./UserProxy";
import { GameVO, PlayerVO, Position } from "./vo/GameVO";

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
    }

    public initRoom(gameType: GameType, action: RoomStartAction) {
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;

        let playerMaxNum = Util.getPlayerCntByType(gameType);
        let userInfo = userProxy.getUserInfo();
        let player = new PlayerVO();
        player.avatarUrl = userInfo.avatarUrl;
        player.nickName = userInfo.nickName;
        player.isReady = false;
        player.playerID = userProxy.getPlayerId();

        this.room = new RoomVO();
        this.room.gameType = gameType;
        this.room.mePlayerIdx = 0;
        this.room.playersInfo = [player];
        this.room.status = RoomStatus.START;
        this.room.startAction = action;

        for (let i = 0; i < playerMaxNum; i++) {
            if (!this.room.playersInfo[i]) {
                this.room.playersInfo.push(new PlayerVO());
            }
        }

        console.log("初始化房间数据");
    }

    public runAction() {
        switch(this.room.startAction) {
            // case this.room.
        }
    }

    // 判断是否已在房间内
    public returnRoom() {
        MgobeService.getMyRoom((event) => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                this.setRoom(event.data.roomInfo);
                // 如果房间有进行中的游戏，才发送消息
                if (MgobeService.isStartFrameSync()) {
                    console.log("玩家所在房间正在游戏中", event);
                    this.facade.sendNotification(RoomNotification.ROOM_RETURN_CHECK);
                } else {
                    console.log("玩家所在房间不在游戏中");
                    this.leaveRoom();
                    this.facade.sendNotification(RoomNotification.ROOM_RETURN_NOT_CHECK);
                }
            } else {
                console.log("玩家不在房间中");
                this.facade.sendNotification(RoomNotification.ROOM_RETURN_NOT_CHECK);
            }
        });
    }

    public joinRoom(roomId: string) {
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
                this.facade.sendNotification(RoomNotification.ROOM_JOIN);
            } else {
                if (event.code == MGOBE.ErrCode.EC_ROOM_PLAYER_ALREADY_IN_ROOM) {
                    this.leaveRoom();
                }
                console.log("加入房间失败", event);
                this.facade.sendNotification(WorldNotification.SHOW_TIPS, { title: "加入房间失败，请重试" });
            }
        });
    }

    public matchPlayers() {
        console.log("发起匹配");

        let callback = (event) => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("发起匹配成功", event);
                // this.setRoom(event.data.roomInfo);
            } else if (event.code == MGOBE.ErrCode.EC_MATCH_TIMEOUT) {
                this.setRoomStatus(RoomStatus.WAIT);
                this.facade.sendNotification(WorldNotification.SHOW_TIPS, { title: "匹配超时，请重试" });
            } else if(event.code == MGOBE.ErrCode.EC_MATCH_PLAYER_IS_IN_MATCH) {
                console.log("已在匹配中", event);
            } else if(event.code == MGOBE.ErrCode.EC_ROOM_PLAYER_ALREADY_IN_ROOM) {
                console.log("已在房间中，离开房间并重试", event);
                this.leaveRoom();
                MgobeService.matchPlayers(this.room.playersInfo[0], Util.getPlayerCntByType(this.room.gameType),
                    this.room.gameType, callback);
            } else {
                console.log("发起匹配失败", event);
                this.setRoomStatus(RoomStatus.WAIT);
                this.facade.sendNotification(WorldNotification.SHOW_TIPS, { title: "匹配失败，请重试" });
            }
        };
        MgobeService.matchPlayers(this.room.playersInfo[0], Util.getPlayerCntByType(this.room.gameType),
            this.room.gameType, callback);
    }

    public cancelMatch() {
        console.log("取消匹配");
        MgobeService.cancelMatch((event) => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("取消匹配成功", event);
                this.setRoomStatus(RoomStatus.WAIT);
            } else {
                console.log("取消匹配失败", event);
            }
        });
    }

    public createRoom(gameType: GameType) {
        this.initRoom(gameType, RoomStartAction.DEFAULT);
        console.log("创建组队房间");
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;
        let userInfo = userProxy.getUserInfo();
        let player = new PlayerVO();
        player.avatarUrl = userInfo.avatarUrl;
        player.nickName = userInfo.nickName;
        player.isReady = false;
        player.playerID = userProxy.getPlayerId();

        MgobeService.createRoom(player, Util.getPlayerCntByType(gameType), gameType, (event) => {

            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("创建房间成功", event);
                this.setRoom(event.data.roomInfo);
                this.facade.sendNotification(RoomNotification.ROOM_CREATE);
            } else {
                if (event.code == MGOBE.ErrCode.EC_ROOM_PLAYER_ALREADY_IN_ROOM) {
                    this.leaveRoom();
                }

                console.log("创建房间失败", event);
                this.facade.sendNotification(WorldNotification.SHOW_TIPS, { title: "创建房间失败，请重试" });
            }
        });
    }

    // 断线时不应该离开房间，  重回游戏时，如果在游戏中，应提示是否返回游戏
    public leaveRoom() {
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;

        MgobeService.getMyRoom((event) => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                MgobeService.leaveRoom((event) => {
                    console.log("离开房间", event);
                    if (event.code === MGOBE.ErrCode.EC_OK || event.code === MGOBE.ErrCode.EC_ROOM_PLAYER_NOT_IN_ROOM) {
                        this.facade.sendNotification(RoomNotification.ROOM_LEAVE);
                    } else {
                        this.facade.sendNotification(WorldNotification.SHOW_TIPS, { title: "离开房间失败，请重试" });
                    }
                });
            } else {
                this.facade.sendNotification(RoomNotification.ROOM_LEAVE);
            }
        });
    }

    public isRoomReady(): boolean {
        if (this.room.playersInfo[0].isReady) {
            return true;
        }

        let playerMaxNum = Util.getPlayerCntByType(this.room.gameType);

        for (let i = 0; i < playerMaxNum; i++) {
            if (this.room.playersInfo[i].playerID == "" || this.room.playersInfo[i].isReady == false) {
                return false;
            }
        }

        return true;
    }

    public setRoomStartAction(action: RoomStartAction) {
        this.room.startAction = action;
    }

    public setReadyStatus(hasReady: boolean) {
        MgobeService.changeCustomPlayerStatus(hasReady ? 1 : 0, (event) => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
            } else {
                this.facade.sendNotification(WorldNotification.SHOW_TIPS, { title: "操作失败，请重试" });
            }
        });
    }

    public setRoomStatus(status: RoomStatus) {
        this.room.status = status;
        this.facade.sendNotification(RoomNotification.ROOM_UPDATE);
    }

    public setRoom(roomInfo: MGOBE.types.RoomInfo) {
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;

        this.room.roomId = roomInfo.id;

        // 获取当前玩家位次
        let meIdx = 0;
        let playerList = roomInfo.playerList;
        for (let i = 0; i < playerList.length; i++) {
            if (playerList[i].id == userProxy.getPlayerId()) {
                meIdx = i;
                break;
            }
        }
        this.room.mePlayerIdx = meIdx;

        // 更新玩家信息
        let playerMaxNum = Util.getPlayerCntByType(this.room.gameType);
        for (let i = 0; i < playerList.length; i++) {
            let new_i = (i + meIdx) % playerMaxNum;
            let playerInfo = this.room.playersInfo[i];

            playerInfo.playerID = playerList[new_i].id;
            playerInfo.avatarUrl = playerList[new_i].customProfile;
            playerInfo.nickName = playerList[new_i].name;
            playerInfo.isReady = playerList[new_i].customPlayerStatus == 1;
        }
        for (let i = playerList.length; i < 4; i++) {
            this.room.playersInfo[i] = new PlayerVO();
        }

        this.facade.sendNotification(RoomNotification.ROOM_UPDATE);
    }

    public getRoom(): RoomVO {
        return this.room;
    }
}
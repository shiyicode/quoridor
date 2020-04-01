import { RoomVO } from "./vo/RoomVO";
import { RoomNotification, GameType, RoomStatus, WorldNotification, PlayerStatus } from "../Constants";
import Util from "../util/Util";
import UserProxy from "./UserProxy";
import { PlayerVO } from "./vo/GameVO";

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

    public initRoom(gameType: GameType) {
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

        if(gameType == GameType.MATCH2 || gameType == GameType.MATCH4) {
            this.room.status = RoomStatus.MATCH_ING;
        } else if(gameType == GameType.TEAM2 || gameType == GameType.TEAM4) {
            this.room.status = RoomStatus.TEAM;
        }

        console.log("初始化房间数据", this.room);
    }

    public isRoomReady(): boolean {
        let playerMaxNum = Util.getPlayerCntByType(this.room.gameType);

        for (let i = 0; i < playerMaxNum; i++) {
            if (!this.room.playersInfo[i] || this.room.playersInfo[i].playerID == "" || this.room.playersInfo[i].isReady == false) {
                return false;
            }
        }

        return true;
    }

    public setPlayerStatus(isReady: boolean) {
        this.room.playersInfo[0].isReady = isReady;
        this.facade.sendNotification(RoomNotification.ROOM_UPDATE);
    }

    public setRoomStatus(status: RoomStatus) {
        this.room.status = status;
        this.facade.sendNotification(RoomNotification.ROOM_UPDATE);
    }

    public setRoom(roomInfo: MGOBE.types.RoomInfo) {
        const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;

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
        this.room.roomId = roomInfo.id;

        this.room.playersInfo = [];

        // 更新玩家信息
        let playerMaxNum = Util.getPlayerCntByType(this.room.gameType);
        for (let i = 0; i < playerList.length; i++) {
            let new_i = (i + meIdx) % playerMaxNum;
            let playerInfo = new PlayerVO();
            playerInfo.playerID = playerList[new_i].id;
            playerInfo.avatarUrl = playerList[new_i].customProfile;
            playerInfo.nickName = playerList[new_i].name;
            playerInfo.isReady = playerList[new_i].customPlayerStatus == 1;
            this.room.playersInfo.push(playerInfo);
        }

        this.facade.sendNotification(RoomNotification.ROOM_UPDATE);
    }

    public getRoom(): RoomVO {
        return this.room;
    }

    // 判断是否已在房间内
    // public returnRoom() {
    //     MgobeService.getMyRoom((event) => {
    //         if (event.code === MGOBE.ErrCode.EC_OK) {
    //             this.setRoom(event.data.roomInfo);
    //             // 如果房间有进行中的游戏，才发送消息
    //             if (MgobeService.isStartFrameSync()) {
    //                 console.log("玩家所在房间正在游戏中", event);
    //                 this.facade.sendNotification(RoomNotification.ROOM_RETURN_CHECK);
    //             } else {
    //                 console.log("玩家所在房间不在游戏中");
    //                 this.leaveRoom();
    //                 this.facade.sendNotification(RoomNotification.ROOM_RETURN_NOT_CHECK);
    //             }
    //         } else {
    //             console.log("玩家不在房间中");
    //             this.facade.sendNotification(RoomNotification.ROOM_RETURN_NOT_CHECK);
    //         }
    //     });
    // }

}
import { Config } from "../../Constants";
import "../../library/mgobe/MGOBE.js";
import { PlayerVO } from "../../model/vo/RoomVO";

export default class MgobeService {
    // 将room置为私有 private
    static room: MGOBE.Room = null;

    static getMyRoom(callback?: (event) => any) {
        MGOBE.Room.getMyRoom(event => {
            console.log("获取当前房间信息", event);
            if (event.code === MGOBE.ErrCode.EC_OK) {
                this.room.roomInfo = event.data.roomInfo;

            }
            callback && callback(event);
        });
    }

    static initRoom(roomId: string, callback?: (event) => any) {
        // const roomInfo = { id: roomId };
        // this.room.initRoom(roomInfo);
        const getRoomByRoomIdPara2 = {
            roomId: roomId,
        };
        MGOBE.Room.getRoomByRoomId(getRoomByRoomIdPara2, (event) => {
            callback && callback(event);
        });
    }

    static joinRoom(roomId: string, player: PlayerVO, callback?: (event) => any) {
        this.initRoom(roomId, (event) => {
            console.log("获取房间信息", roomId, event);
            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("获取房间信息, 更新成功", roomId);
                this.room.initRoom(event.data.roomInfo);

            }
            const playerInfo: MGOBE.types.PlayerInfoPara = {
                name: player.nickName,
                customPlayerStatus: player.isReady ? 1 : 0,
                customProfile: player.avatarUrl,
            };

            const joinRoomPara: MGOBE.types.JoinRoomPara = {
                playerInfo: playerInfo,
            };
            this.room.joinRoom(joinRoomPara, (event) => {
                callback && callback(event);
            });
        });
    }

    static createRoom(player: PlayerVO, maxPlayers: number, roomType: string, callback?: (event) => any) {
        const playerInfo: MGOBE.types.PlayerInfoPara = {
            name: player.nickName,
            customPlayerStatus: player.isReady ? 1 : 0,
            customProfile: player.avatarUrl,
        };

        const createRoomPara: MGOBE.types.CreateRoomPara = {
            roomName: "房间名",
            maxPlayers: maxPlayers,
            roomType: roomType,
            isPrivate: false,
            customProperties: "WAIT",
            playerInfo: playerInfo,
        };

        this.room.createRoom(createRoomPara, (event) => {
            callback && callback(event);
        });
    }

    static leaveRoom(callback?: (event) => any) {
        this.room.leaveRoom({}, event => {
            callback && callback(event);
        });
    }

    static changeCustomPlayerStatus(customPlayerStatus, callback?: (event) => any) {
        const changeCustomPlayerStatusPara = {
            customPlayerStatus
        };

        this.room.changeCustomPlayerStatus(changeCustomPlayerStatusPara, event => {
            callback && callback(event);
        });
    }

    static isInited(): boolean {
        // 初始化成功后才有玩家ID
        return !!MGOBE.Player && !!MGOBE.Player.id;
    }

    static initMgobeSDK(openId: string, gameId: string, secretKey: string, url: string, cacertNativeUrl: string, callback?: (event: { code: MGOBE.ErrCode }) => any): void {
        // 如果已经初始化，直接回调成功
        if (this.isInited()) {
            return callback && callback({ code: MGOBE.ErrCode.EC_OK });
        }

        let gameInfo: MGOBE.types.GameInfoPara = {
            gameId: gameId,
            secretKey: secretKey,
            openId: openId,
        }
        let config: MGOBE.types.ConfigPara = {
            url: url,
            reconnectInterval: Config.reconnectInterval,
            reconnectMaxTimes: Config.reconnectMaxTimes,
            resendInterval: Config.resendInterval,
            resendTimeout: Config.resendTimeout,
            isAutoRequestFrame: true,
            cacertNativeUrl: cacertNativeUrl,
        }

        MGOBE.DebuggerLog.enable = Config.isDebug;

        // if (cc.sys.isNative) {
        //     MGOBE.DebuggerLog.enable = false;
        // }

        // 初始化
        MGOBE.Listener.init(gameInfo, config, event => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("初始化成功");
                // 初始化后才能添加监听
                this.room = new MGOBE.Room();
                MGOBE.Listener.add(this.room);
                // 设置默认广播
                this.setBroadcastCallbacks(null, {});
            } else {
                console.log("初始化失败", event.code);
            }
            callback && callback({ code: event.code });
        });
    }

    // TODO 将callback注册放到这里 将room
    static setCallbacks() {

    }

    /**
     * 设置房间广播回调函数
     * @param broadcastCallbacks
     */
    static setBroadcastCallbacks(context: any, broadcastCallbacks?: BroadcastCallbacks) {

        if (!this.room) {
            return;
        }

        // 默认回调函数
        const generateDefaultCallback = (tag: string) => (event) => { console.log(tag, "->", event); };

        const defaultCallbacks: BroadcastCallbacks = {
            onUpdate: () => generateDefaultCallback("onUpdate"),
            onJoinRoom: () => generateDefaultCallback("onJoinRoom"),
            onLeaveRoom: () => generateDefaultCallback("onLeaveRoom"),
            onChangeRoom: () => generateDefaultCallback("onChangeRoom"),
            onDismissRoom: () => generateDefaultCallback("onDismissRoom"),
            onStartFrameSync: () => generateDefaultCallback("onStartFrameSync"),
            onStopFrameSync: () => generateDefaultCallback("onStopFrameSync"),
            onRecvFrame: (event: MGOBE.types.BroadcastEvent<MGOBE.types.RecvFrameBst>) => {
                generateDefaultCallback("onRecvFrame");
                // 每次收到帧广播都需要计算
                // calcFrame(event.data.frame);
            },
            onChangeCustomPlayerStatus: () => generateDefaultCallback("onChangeCustomPlayerStatus"),
            onRemovePlayer: () => generateDefaultCallback("onRemovePlayer"),
            onRecvFromClient: () => generateDefaultCallback("onRecvFromClient"),
            onRecvFromGameSvr: () => generateDefaultCallback("onRecvFromGameSvr"),
            onAutoRequestFrameError: () => generateDefaultCallback("onAutoRequestFrameError"),
        };

        // 给 room 实例设置广播回调函数
        Object.keys(defaultCallbacks).forEach((key: keyof BroadcastCallbacks) => {
            const callback = broadcastCallbacks[key] ? broadcastCallbacks[key].bind(context) : defaultCallbacks[key];
            this.room[key] = callback;
        });
    }
}

interface BroadcastCallbacks {
    onUpdate?,
    onJoinRoom?,
    onLeaveRoom?,
    onChangeRoom?,
    onDismissRoom?,
    onStartFrameSync?,
    onStopFrameSync?,
    onRecvFrame?,
    onChangeCustomPlayerStatus?,
    onRemovePlayer?,
    onRecvFromClient?,
    onRecvFromGameSvr?,
    onAutoRequestFrameError?,
}
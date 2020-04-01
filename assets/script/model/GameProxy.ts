import { RoomVO } from "./vo/RoomVO";
import { WallType, PlayerStatus, GameStatus, RoomStatus } from "../Constants";
import Util from "../util/Util";
import { GameVO, PlayerVO, Position, WallVO } from "./vo/GameVO";

import RoomProxy from "./RoomProxy";
// 直接使用 MGOBE

export default class GameProxy extends puremvc.Proxy implements puremvc.IProxy {
    public static NAME: string = "GameProxy";
    private static instance: GameProxy = null;
    private game: GameVO = null;
    // 帧广播消息缓存
    private frames: MGOBE.types.Frame[] = [];

    public static getInstance() {
        if (!this.instance) {
            this.instance = new GameProxy();
        }
        return this.instance;
    }

    public constructor() {
        super(GameProxy.NAME);
        this.game = new GameVO();
    }

    public getGame() {
        return this.game;
    }

    public getFrames() {
        return this.frames;
    }

    public pushFrame(frame: MGOBE.types.Frame) {
        this.frames.push(frame);
    }

    public clearFrame() {
        this.frames = [];
    }

    public addWall(playerId, position: Position, wallType: WallType) {
        let playerMaxNum = Util.getPlayerCntByType(this.game.gameType);
        for (let i = 0; i < playerMaxNum; i++) {
            if (this.game.playersInfo[i].playerID == playerId) {
                this.game.playersInfo[i].wallLeftCnt--;
            }
        }
        this.game.walls.push(new WallVO(wallType, position));
    }

    public moveChess(playerId, position: Position) {
        let playerMaxNum = Util.getPlayerCntByType(this.game.gameType);
        for (let i = 0; i < playerMaxNum; i++) {
            if (this.game.playersInfo[i].playerID == playerId) {
                this.game.playersInfo[i].chessPosition = position;
            }
        }
    }

    public checkEnd() {
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;

        let playerMaxNum = Util.getPlayerCntByType(this.game.gameType);
        // 只要有一个到达，就算结束
        for (let i = 0; i < playerMaxNum; i++) {
            if (this.game.playersInfo[i].result != 0) {
                this.game.status = GameStatus.END;
                roomProxy.setRoomStatus(RoomStatus.GAME_END);
                this.game.nowPlayerID = "";
                return;
            }
        }

        let onlineNum = 0;
        let player: PlayerVO;
        for (let i = 0; i < playerMaxNum; i++) {
            if (this.game.playersInfo[i].status == PlayerStatus.DEFAULT
                || this.game.playersInfo[i].status == PlayerStatus.OFFLINE) {
                onlineNum++;
                player = this.game.playersInfo[i];
            }
        }
        if (onlineNum <= 1) {
            this.game.status = GameStatus.END;
            roomProxy.setRoomStatus(RoomStatus.GAME_END);
            this.game.nowPlayerID = "";
            player.result = 1;
        }
    }

    public changeNowPlayer(time: number) {
        console.log("切换玩家");
        if (this.game.nowPlayerID == "") {
            return;
        }
        let playerMaxNum = Util.getPlayerCntByType(this.game.gameType);
        let idx = 0;
        for (let i = 0; i < playerMaxNum; i++) {
            if (this.game.nowPlayerID == this.game.playersInfo[i].playerID) {
                idx = i;
            }
        }

        for (let i = 1; i < playerMaxNum; i++) {
            let newIdx = (idx + i) % playerMaxNum;
            if (this.game.playersInfo[newIdx].result == 0
                && (this.game.playersInfo[newIdx].status == PlayerStatus.DEFAULT
                    || this.game.playersInfo[newIdx].status == PlayerStatus.OFFLINE)
                && this.game.status != GameStatus.END) {
                this.game.nowPlayerID = this.game.playersInfo[newIdx].playerID;
                this.game.nowActionStartTime = time;
                break;
            }
        }
    }

    public setPlayerResult(playerId: string, result: number) {
        this.game.playersInfo.forEach((player) => {
            if (player.playerID == playerId) {
                player.result = result;
            }
        });
    }

    public getMaxPlayerResult(): number {
        let maxResult = 0;
        this.game.playersInfo.forEach((player) => {
            maxResult = Math.max(maxResult, player.result);
        });
        return maxResult;
    }

    public setPlayerStatus(playerId: string, status) {
        this.game.playersInfo.forEach((player) => {
            if (player.playerID == playerId) {
                player.status = status;
            }
        });
    }

    public createGame(room: RoomVO) {
        const roomProxy = this.facade.retrieveProxy(RoomProxy.NAME) as RoomProxy;
        roomProxy.setRoomStatus(RoomStatus.GAME_ING);

        let playerMaxNum = Util.getPlayerCntByType(room.gameType);

        this.game = new GameVO();
        this.game.walls = [];
        this.game.gameType = room.gameType;
        this.game.mePlayerIdx = room.mePlayerIdx;

        let firstPlayerIdx = (playerMaxNum - room.mePlayerIdx) % playerMaxNum;
        this.game.nowPlayerID = room.playersInfo[firstPlayerIdx].playerID;

        this.game.nowActionStartTime = Date.parse(new Date().toString());
        this.game.maxActionDuration = 30;

        let positions = [];
        if (playerMaxNum == 2) {
            positions = [
                new Position(4, 0),
                new Position(4, 8),
            ];
        } else {
            positions = [
                new Position(4, 0),
                new Position(0, 4),
                new Position(4, 8),
                new Position(8, 4),
            ];
        }

        for (let i = 0; i < playerMaxNum; i++) {
            let gamePlayer = this.game.playersInfo[i];
            let roomPlayer = room.playersInfo[i];
            // TODO 临时，人数足够时不会有这个错
            if (roomPlayer) {

                gamePlayer.avatarUrl = roomPlayer.avatarUrl;
                gamePlayer.nickName = roomPlayer.nickName;
                gamePlayer.playerID = roomPlayer.playerID;
                gamePlayer.wallLeftCnt = playerMaxNum == 2 ? 10 : 5;
                gamePlayer.chessPosition = positions[i];
                gamePlayer.status = PlayerStatus.DEFAULT;
            }
        }
        console.log("游戏创建", this.game);
    }
}
import { RoomVO } from "./vo/RoomVO";
import { RoomNotification, GameType, RoomStatus, WorldNotification, GameNotification, WallType, GameAction, PlayerStatus } from "../Constants";
import Util from "../util/Util";
import UserProxy from "./UserProxy";
import { GameVO, PlayerVO, Position, WallVO } from "./vo/GameVO";

// 只需要在使用 MGOBE 之前 import 一次该文件
import "../library/mgobe/MGOBE.js";
import MgobeService from "../services/mgobe/MgobeService";
import RoomProxy from "./RoomProxy";
// 直接使用 MGOBE
const { Room, Listener, ErrCode, ENUM, DebuggerLog } = MGOBE;

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
        for(let i=0; i<playerMaxNum; i++) {
            if(this.game.playersInfo[i].playerID == playerId) {
                this.game.playersInfo[i].wallLeftCnt--;
            }
        }
        this.game.walls.push(new WallVO(wallType, position));
    }

    public moveChess(playerId, position: Position) {
        let playerMaxNum = Util.getPlayerCntByType(this.game.gameType);
        for(let i=0; i<playerMaxNum; i++) {
            if(this.game.playersInfo[i].playerID == playerId) {
                this.game.playersInfo[i].chessPosition = position;
            }
        }
    }

    public changeNowPlayer() {
        console.log("切换玩家");
        let playerMaxNum = Util.getPlayerCntByType(this.game.gameType);
        let idx = 0;
        for (let i = 0; i < playerMaxNum; i++) {
            if (this.game.nowPlayerID == this.game.playersInfo[i].playerID) {
                idx = i;
                break;
            }
        }
        let newIdx = (idx + 1) % playerMaxNum;

        // let newIdx;
        // do {
        //    newIdx = (idx + 1) % playerMaxNum;
        // } while(this.game.playersInfo[newIdx].status == PlayerStatus.START);
        this.game.nowPlayerID = this.game.playersInfo[newIdx].playerID;
        this.game.nowActionStartTime = Date.parse(new Date().toString());
    }

    public setPlayerStatus(playerId, status) {
        this.game.playersInfo.forEach((player) => {
            if (player.playerID == playerId) {
                player.status = status;
            }
        });
    }

    public createGame(room: RoomVO) {
        let playerMaxNum = Util.getPlayerCntByType(room.gameType);

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
                gamePlayer.status = PlayerStatus.START;

                console.log("-==-=-", i, gamePlayer, this.game.playersInfo[i]);
            }
        }
        console.log("游戏创建", this.game);
    }
}
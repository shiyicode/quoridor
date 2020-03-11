import { RoomVO } from "./vo/RoomVO";
import { RoomNotification, GameType, RoomStatus, WorldNotification, GameNotification, WallType } from "../Constants";
import Util from "../util/Util";
import UserProxy from "./UserProxy";
import { GameVO, PlayerVO, Position, WallVO } from "./vo/GameVO";

// 只需要在使用 MGOBE 之前 import 一次该文件
import "../library/mgobe/MGOBE.js";
import MgobeService from "../services/mgobe/MgobeService";
// 直接使用 MGOBE
const { Room, Listener, ErrCode, ENUM, DebuggerLog } = MGOBE;

export default class GameProxy extends puremvc.Proxy implements puremvc.IProxy {
    public static NAME: string = "GameProxy";
    private static instance: GameProxy = null;
    private game: GameVO = null;

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

    public addWall(position: Position, wallType:WallType) {
        this.game.walls.push(new WallVO(wallType, position));
        this.sendNotification(GameNotification.GAME_UPDATE);
    }

    public moveChess(position: Position) {
        // this.game.walls.push(new WallVO(wallType, position));
        this.game.playersInfo[0].chessPosition = position;
        this.sendNotification(GameNotification.GAME_UPDATE);
    }

    public createGame(room: RoomVO) {
        let playerMaxNum = Util.getPlayerCntByType(room.gameType);

        this.game.gameType = room.gameType;
        this.game.mePlayerIdx = room.mePlayerIdx;

        let firstPlayerIdx = playerMaxNum - room.mePlayerIdx;
        this.game.nowPlayerID = room.playersInfo[firstPlayerIdx].playerID;

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
                console.log("-==-=-", i, gamePlayer, this.game.playersInfo[i]);
            }
        }

        this.facade.sendNotification(GameNotification.GAME_START);
    }
}
import { WallType, GameType } from "../../Constants";
import Util from "../../util/Util";

export class GameVO {
    gameType: GameType; // 游戏模式
    nowPlayerID: string; // 当前流程游戏玩家
    nowActionStartTime: number; // 当前玩家操作开始时间
    maxActionDuration: number; // 当前玩家操作时间长度

    walls: Array<WallVO>;
    playersInfo: Array<PlayerVO>;

    public constructor(gameType: GameType) {
        this.gameType = gameType;
        this.nowPlayerID = "";

        this.walls = new Array<WallVO>();
        this.playersInfo = new Array<PlayerVO>();

        let playerCnt = Util.getPlayerCntByType(gameType);
        for(let i=0; i<playerCnt; i++) {
            this.playersInfo.push(new PlayerVO());
        }
    }
}

export class PlayerVO {
    playerID: number;
    chessPosition: Position;
    wallLeftCnt: number;
    avatarUrl: string;
    nickName: string;
    public constructor() {
        this.chessPosition = new Position();
    }
}

export class ChessBoardVO {

}

export class WallVO {
    position: Position;
    wallType: WallType;
    public constructor(wallType: WallType, position: Position) {
        this.position = position;
        this.wallType = wallType;
    }
}

export class Position {
    x : number;
    y : number;
    public constructor(x: number=0, y: number=0) {
        this.x = x;
        this.y = y;
    }
}
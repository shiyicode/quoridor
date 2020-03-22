import { WallType, GameType } from "../../Constants";
import Util from "../../util/Util";

export class GameVO {
    gameType: GameType; // 游戏模式
    nowPlayerID: string; // 当前流程游戏玩家
    nowActionStartTime: number; // 当前玩家操作开始时间
    maxActionDuration: number; // 当前玩家操作时间长度
    mePlayerIdx: number;
    walls: Array<WallVO>;
    playersInfo: Array<PlayerVO>;

    public constructor() {
        this.nowPlayerID = "";

        this.walls = new Array<WallVO>();
        this.playersInfo = new Array<PlayerVO>();

        for(let i=0; i<4; i++) {
            this.playersInfo.push(new PlayerVO());
        }
    }
}

export class PlayerVO {
    playerID: string = "";
    isReady: boolean = false;
    chessPosition: Position;
    wallLeftCnt: number;
    avatarUrl: string = "";
    nickName: string = "";
    status: number = 0;
    value: number = 0;
    public constructor() {
        this.chessPosition = new Position();
    }
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
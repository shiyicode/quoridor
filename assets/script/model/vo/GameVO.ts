import { WallType } from "../../Constants";

export class GameVO {
    gameType: string; // 游戏模式
    nowPlayerID: number; // 当前流程游戏玩家
    nowActionStartTime: number; // 当前玩家操作开始时间
    maxActionDuration: number; // 当前玩家操作时间长度

    walls: Array<WallVO>;
    playersInfo: Array<PlayerVO>;

    public constructor() {
    }
}

export class PlayerVO {
    playerID: number;
    chessPosition: Position;
    wallLeftCnt: number;
    avatarUrl: string;
    nickName: string;
}

export class ChessBoardVO {

}

export class WallVO {
    position: Position;
    wallType: WallType;
}

export class Position {
    x : number;
    y : number;
}
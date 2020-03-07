export class GameVO {
    gameType: string;
    // gameTime:
    nowPlayerID: number;
    // nowStartTime
    maxDuration: number;

    wallPositions: Array<Position>;
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

export class Position {
    x : number;
    y : number;
}
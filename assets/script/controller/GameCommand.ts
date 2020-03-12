// import GameCommand from "../model/GameCommand";
import { GameNotification, GameType, ChessboardLimit, WallType } from "../Constants";
import { GameVO, WallVO, Position } from "../model/vo/GameVO";
import RoomProxy from "../model/RoomProxy";
import GameProxy from "../model/GameProxy";
// import { Platform } from "../services/platform/IPlatform";

export default class GameCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

    public constructor() {
        super();
    }

    public static NAME: string = 'GameCommand';

    /**
     * 注册消息
     */
    public register(): void {
        // this.facade.registerCommand(GameNotification.TEST_GAME, GameCommand);  //注册移动的消息
    }

    public execute(notification: puremvc.INotification): void {
        // const { gameType } = notification.getBody();
        switch (notification.getName()) {
            // case GameNotification.TEST_GAME: {
            // }
        }
    }

    /**
     * @desc 墙体坐标转换
     * @param wallInfo  墙体信息
     * @param rotationCnt 需要转换的次数，正数代表顺时针转换次数，负数代表逆时针转换次数，每次转换为90°
     * @return WallVO
     */
    rotationWall(playerID: string, wallInfo: WallVO): WallVO {
        const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;
        let game = gameProxy.getGame();
        let playerCount = 2;
        let rotationMul = 2;
        if (game.gameType == GameType.TEAM4) {
                playerCount = 4;
                // 4人游戏中，如果需要转换，每隔一个用户需要转换1次，所以最终转换次数要乘1
                rotationMul = 1;
        }

        let playerIndex = 0;
        // 获取playerID对应用户信息的下标
        for (let i = 0; i < playerCount; i++) {
            if (game.playersInfo[i].playerID == playerID) {
                playerIndex = i;
            }
        }

        let rotationCnt = -(rotationMul * playerIndex);
        let position = this.rotationPosition(wallInfo.position, ChessboardLimit.WALL_LIMIT-1, ChessboardLimit.WALL_LIMIT-1, rotationCnt);

        let wallType = wallInfo.wallType;
        if ((rotationCnt)%2 != 0) {
            if (wallType == WallType.HORIZONTAL) {
                wallType = WallType.VERTICAL;
            } else if (wallType == WallType.VERTICAL) {
                wallType = WallType.HORIZONTAL;
            }
        }

        return new WallVO(wallType, position);
    }

    /**
     * @desc 棋子坐标转换
     * @param Position  棋子坐标信息
     * @param rotationCnt 需要转换的次数，正数代表顺时针转换次数，负数代表逆时针转换次数，每次转换为90°
     * @return Position
     */
    rotationChess(playerID: string, chessInfo: Position): Position {
        const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;
        let game = gameProxy.getGame();
        let playerCount = 2;
        let rotationMul = 2;
        if (game.gameType == GameType.TEAM4) {
                playerCount = 4;
                // 4人游戏中，如果需要转换，每隔一个用户需要转换1次，所以最终转换次数要乘1
                rotationMul = 1;
        }

        let playerIndex = 0;
        // 获取playerID对应用户信息的下标
        for (let i = 0; i < playerCount; i++) {
            if (game.playersInfo[i].playerID == playerID) {
                playerIndex = i;
            }
        }

        let rotationCnt = -(rotationMul * playerIndex);
        return this.rotationPosition(chessInfo, ChessboardLimit.CHESS_LIMIT-1, ChessboardLimit.CHESS_LIMIT-1, rotationCnt);
    }

    /**
     * @desc Position坐标转换
     * @param pos 需要转换的初始坐标
     * @param width  棋盘宽度(因为坐标以0为起始，所以初始调用时需使用正常宽度-1)
     * @param height 棋盘高度(同宽度)
     * @param rotationCnt 需要转换的次数，正数代表顺时针转换次数，负数代表逆时针转换次数，每次转换为90°
     * @return Position
     */
    rotationPosition(pos: Position, width: number, height: number, rotationCnt: number): Position {
        let resultPos = new Position();
        if (rotationCnt > 0) {
            resultPos.x = height - pos.y;
            resultPos.y = pos.x;
            resultPos = this.rotationPosition(resultPos, height, width, rotationCnt-1);
        } else if(rotationCnt < 0) {
            resultPos.x = pos.y;
            resultPos.y = width - pos.x;
            resultPos = this.rotationPosition(resultPos, height, width, rotationCnt+1);
        } else {
            resultPos.x = pos.x;
            resultPos.y = pos.y;
        }
        return resultPos;
    }
}
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
     * @desc 判断用户是否结束
     * @param playerID 需要判断的用户 ID
     * @param pos 用户坐标
     * @return boolean 用户是否结束
     */
    isUserEnd(playerID: string, pos: Position): boolean{
        let rotationPos = this.rotationChess(playerID, pos);

        return rotationPos.y == ChessboardLimit.CHESS_LIMIT-1;
    }

    /**
     * @desc 获取用户可走的位置
     * @param playerID 用户唯一标识
     * @return WallVO
     */
    getAllLocation(playerID: string): Array<Position> {
        const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;
        let gameInfo = gameProxy.getGame();

        let playerCount = 2;
        if (gameInfo.gameType == GameType.TEAM4) {
            playerCount = 4;
        }

        let playerIndex = 0;
        let otherPlayerPos = new Array<Position>();
        // 获取playerID对应用户信息的下标
        for (let i = 0; i < playerCount; i++) {
            if (gameInfo.playersInfo[i].playerID == playerID) {
                playerIndex = i;
            } else {
                otherPlayerPos.push(gameInfo.playersInfo[i].chessPosition);
            }
        }

        let arrivalMap = this.initWallMap(gameInfo.walls);

        let legalCoordinate = new Array<Position>();
        // {0，1，2，3}对应{向上，向下，向左，向右}
        for (let directions = 0; directions < 4; directions++) {
            let nowPlayerPos = new Position();
            nowPlayerPos.x = gameInfo.playersInfo[playerIndex].chessPosition.x;
            nowPlayerPos.y = gameInfo.playersInfo[playerIndex].chessPosition.y;
            let locations = this.checkDirection(directions, arrivalMap, otherPlayerPos, nowPlayerPos);
            for (let i = 0; i < locations.length; i++) {
                legalCoordinate.push(locations[i]);
            }
        }

        return legalCoordinate;
    }

    /**
     * @desc 判断墙是否合法
     * @param wallInfo  墙体信息
     * @return boolean
     */
    isWallLegal(playerId: string, wallInfo: WallVO): boolean {
        const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;
        let gameInfo = gameProxy.getGame();
        if (wallInfo.position.x < 0 || wallInfo.position.x >= ChessboardLimit.WALL_LIMIT
            || wallInfo.position.y < 0 || wallInfo.position.y >= ChessboardLimit.WALL_LIMIT
        ) {
            return false;
        }

        wallInfo = this.rotationWall(playerId, wallInfo);

        for (let i = 0; i < gameInfo.walls.length; i++) {
            if (gameInfo.walls[i].position.x == wallInfo.position.x
                && gameInfo.walls[i].position.y == wallInfo.position.y
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * @desc 判断墙是否会封死棋子的所有位置
     * @param wallInfo  墙体信息
     * @return boolean
     */
    // isWallSeal(wallInfo: WallVO): boolean {
    //     const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;
    //     let gameInfo = gameProxy.getGame();
    // }

    /**
     * @desc 墙体坐标转换
     * @param playerID 用户唯一标识
     * @param wallInfo  墙体信息
     * @return WallVO
     */
    rotationWall(playerID: string, wallInfo: WallVO): WallVO {
        const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;
        let gameInfo = gameProxy.getGame();
        let playerCount = 2;
        let rotationMul = 2;
        if (gameInfo.gameType == GameType.TEAM4) {
                playerCount = 4;
                // 4人游戏中，如果需要转换，每隔一个用户需要转换1次，所以最终转换次数要乘1
                rotationMul = 1;
        }

        let playerIndex = 0;
        // 获取playerID对应用户信息的下标
        for (let i = 0; i < playerCount; i++) {
            if (gameInfo.playersInfo[i].playerID == playerID) {
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
     * @param playerID 用户唯一标识
     * @param chessInfo  棋子坐标信息
     * @return Position
     */
    rotationChess(playerID: string, chessInfo: Position): Position {
        const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;
        let gameInfo = gameProxy.getGame();
        let playerCount = 2;
        let rotationMul = 2;
        if (gameInfo.gameType == GameType.TEAM4) {
                playerCount = 4;
                // 4人游戏中，如果需要转换，每隔一个用户需要转换1次，所以最终转换次数要乘1
                rotationMul = 1;
        }

        let playerIndex = 0;
        // 获取playerID对应用户信息的下标
        for (let i = 0; i < playerCount; i++) {
            if (gameInfo.playersInfo[i].playerID == playerID) {
                playerIndex = i;
            }
        }

        let rotationCnt = -(rotationMul * playerIndex);
        return this.rotationPosition(chessInfo, ChessboardLimit.CHESS_LIMIT-1, ChessboardLimit.CHESS_LIMIT-1, rotationCnt);
    }




    /**
     * @desc 获取一个方向的可走坐标， {0，1，2，3}对应{向上，向下，向左，向右}
     * @param directionType {0，1，2，3}对应{向上，向下，向左，向右}
     * @param arrivalMap 墙对应方向是否可走的 map
     * @param otherPlayerPos 其他用户棋子的坐标
     * @param nowPos 当前判断时的坐标
     * @return arrivalMap
     */
    checkDirection(directionType: number, arrivalMap: Array<Array<Array<boolean>>>, otherPlayerPos: Array<Position>, nowPos: Position): Array<Position>{
        let legalCoordinate = new Array<Position>();
        let judgePos = this.getJudgePos(directionType, nowPos);

        if (this.isTransboundary(judgePos)) {
            return legalCoordinate;
        }

        // 选择走子的方向不存在墙
        if (arrivalMap[nowPos.x][nowPos.y][directionType]) {
            // 有对方棋子
            if (this.isLocHasPiece(judgePos, otherPlayerPos)) {
                // 该位置不可放，尝试跳过该棋子且走向相同方向的下一个位置
                nowPos.x = judgePos.x;
                nowPos.y = judgePos.y;
                judgePos = this.getJudgePos(directionType, nowPos);

                // 如果该方向未越界且无墙则直接可落子
                if (!this.isTransboundary(judgePos) && arrivalMap[nowPos.x][nowPos.y][directionType] ) {
                    // 不存在棋子且未越界
				    if (!this.isLocHasPiece(judgePos, otherPlayerPos)) {
					    legalCoordinate.push(judgePos);
				    }
                } else {
                    if (directionType == 0 || directionType == 1) {
                        // 判断左右
                        if (arrivalMap[nowPos.x][nowPos.y][2]) {
                            // 判断左
                            let leftPos = new Position(nowPos.x-1, nowPos.y);
                            if (!this.isTransboundary(leftPos) && !this.isLocHasPiece(leftPos, otherPlayerPos)) {
                                legalCoordinate.push(leftPos);
                            }
                        }
                        if (arrivalMap[nowPos.x][nowPos.y][3]) {
                            // 判断右
                            let rightPos = new Position(nowPos.x+1, nowPos.y);
                            if (!this.isTransboundary(rightPos) && !this.isLocHasPiece(rightPos, otherPlayerPos)) {
                                legalCoordinate.push(rightPos);
                            }
                        }
                    } else {
                        // 判断上下
                        if (arrivalMap[nowPos.x][nowPos.y][0]) {
                            // 判断上
                            let upPos = new Position(nowPos.x, nowPos.y+1);
                            if (!this.isTransboundary(upPos) && !this.isLocHasPiece(upPos, otherPlayerPos)) {
                                legalCoordinate.push(upPos);
                            }
                        }
                        if (arrivalMap[nowPos.x][nowPos.y][1]) {
                            // 判断下
                            let downPos = new Position(nowPos.x,nowPos.y-1);
                            if (!this.isTransboundary(downPos) && !this.isLocHasPiece(downPos, otherPlayerPos)) {
                                legalCoordinate.push(downPos);
                            }
                        }
                    }
                }

            } else {
                legalCoordinate.push(judgePos);
            }
        }

        return legalCoordinate;
    }

    /**
     * @desc 获取指定方向走一步的坐标
     * @param directionType {0，1，2，3}对应{向上，向下，向左，向右}
     * @param nowPos 当前判断时的坐标
     * @return boolean
     */
    getJudgePos(directionType: number, nowPos: Position): Position{
        let judgePos = new Position();
        switch (directionType) {
            case 0:
                judgePos.x = nowPos.x;
                judgePos.y = nowPos.y+1;
                break;
            case 1:
                judgePos.x = nowPos.x;
                judgePos.y = nowPos.y-1;
                break;
            case 2:
                judgePos.x = nowPos.x-1;
                judgePos.y = nowPos.y;
                break;
            case 3:
                judgePos.x = nowPos.x+1;
                judgePos.y = nowPos.y;
                break;
        }
        return judgePos;
    }

    /**
     * @desc 判断棋子是否越界
     * @param pos 当前需要判断的位置
     * @return boolean
     */
    isTransboundary(pos: Position): boolean {
        if (pos.x < 0 || pos.x >= ChessboardLimit.CHESS_LIMIT
            || pos.y < 0 || pos.y >= ChessboardLimit.CHESS_LIMIT
        ) {
            return true;
        }

        return false;
    }

    /**
     * @desc 判断位置是否存在棋子
     * @param pos 当前需要判断的位置
     * @param otherPlayerPos  其他用户的棋子位置
     * @return boolean
     */
    isLocHasPiece(pos: Position, otherPlayerPos: Array<Position>): boolean {
        for (let i = 0; i < otherPlayerPos.length; i++) {
            if (pos.x == otherPlayerPos[i].x && pos.y == otherPlayerPos[i].y) {
                return true;
            }
        }
        return false;
    }


    /**
     * @desc 获取墙对应方向是否可走的 map， {0，1，2，3}对应{向上，向下，向左，向右}
     * @param walls 现有墙的信息
     * @return arrivalMap
     */
    initWallMap(walls: Array<WallVO>): Array<Array<Array<boolean>>>{
        let arrivalMap = new Array<Array<Array<boolean>>>();
        for (let i = 0; i < ChessboardLimit.CHESS_LIMIT; i++) {
            let arrival = new Array<Array<boolean>>();
            for (let j = 0; j < ChessboardLimit.CHESS_LIMIT; j++) {
                let arr = new Array<boolean>();
                //可以向上
			    if (j >= 0 && j < ChessboardLimit.CHESS_LIMIT-1) {
				    arr[0] = true
			    }
			    //可以向下
                if (j > 0 && j <= ChessboardLimit.CHESS_LIMIT-1) {
                    arr[1] = true
                }
			    //可以向左
			    if (i > 0 && i <= ChessboardLimit.CHESS_LIMIT-1) {
				    arr[2] = true
			    }
			    //可以向右
			    if (i >= 0 && i < ChessboardLimit.CHESS_LIMIT-1) {
				    arr[3] = true
			    }
			    arrival[j] = arr;
            }
            arrivalMap[i] = arrival;
        }

        for (let i = 0; i < walls.length; i++) {
            //横木板
            if (walls[i].wallType == "horizontal") {
                arrivalMap[walls[i].position.x][walls[i].position.y][0] = false
                arrivalMap[walls[i].position.x+1][walls[i].position.y][0] = false
                arrivalMap[walls[i].position.x][walls[i].position.y+1][1] = false
                arrivalMap[walls[i].position.x+1][walls[i].position.y+1][1] = false
            }
            //纵木板
            if (walls[i].wallType == "vertical") {
                arrivalMap[walls[i].position.x+1][walls[i].position.y][2] = false
                arrivalMap[walls[i].position.x+1][walls[i].position.y+1][2] = false
                arrivalMap[walls[i].position.x][walls[i].position.y][3] = false
                arrivalMap[walls[i].position.x][walls[i].position.y+1][3] = false
            }
        }

        return arrivalMap;
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
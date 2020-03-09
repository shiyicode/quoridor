// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { World } from "../Store/World";
import { GameVO, Position } from "../../model/vo/GameVO";
import Util from "../../util/Util";
import { WallType } from "../../Constants";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChessBoard extends cc.Component {

    @property(cc.Prefab)
    hWall: cc.Prefab = null;

    @property(cc.Prefab)
    vWall: cc.Prefab = null;

    @property(cc.Prefab)
    hWallShadow: cc.Prefab = null;

    @property(cc.Prefab)
    vWallShadow: cc.Prefab = null;

    @property(cc.Prefab)
    chessPrefab: cc.Prefab = null;

    chessNodes: Array<cc.Node> = [];

    // 单位长度
    unit: number;
    // 横木板组件宽度
    wallNodeWidth: number;

    wallNodes: Array<cc.Node> = [];
    wallPositions: Array<cc.Vec2> = [];

    // 用于墙操作
    touchWallNode: cc.Node;
    touchWallShadowNode: cc.Node;
    touchWallType: WallType;
    touchWallPosition: Position;
    touchStartPosition: Position;

    onLoad() {
        let chessBoardSize = this.node.getContentSize();
        // 单位长度
        this.unit = chessBoardSize.width / 44;

        for (let i = 0; i < 4; i++) {
            let chessNode = cc.instantiate(this.chessPrefab);
            chessNode.parent = this.node;
            chessNode.name = 'chess' + i.toString();
            chessNode.active = false;
            this.chessNodes.push(chessNode);
        }
        this.listenChessBoard();

        let wallNode = cc.instantiate(this.hWall);
        this.wallNodeWidth = wallNode.getContentSize().width;
    }

    initView(game: GameVO) {
        let playerCnt = Util.getPlayerCntByType(game.gameType);

        // 初始化棋子
        for (let i = 0; i < playerCnt; i++) {
            console.log("显示棋子");
            this.setChessView(this.chessNodes[i], game.playersInfo[i].avatarUrl);
            this.chessNodes[i].active = true;
        }
        // 设置当前玩家棋子可点击
        let chessButton = this.chessNodes[0].getComponent(cc.Button);
        chessButton.interactable = true;
        // chessButton.node.on()
        // 初始化用户信息

        this.updateView(game);
    }

    updateView(game: GameVO) {
        let playerCnt = Util.getPlayerCntByType(game.gameType);

        // 初始化棋子
        for (let i = 0; i < playerCnt; i++) {
            console.log("===", i, game.playersInfo[i]);
            this.setChessPosition(this.chessNodes[i], game.playersInfo[i].chessPosition);
        }

        // 初始化墙
        this.clearWall();
        for (let i = 0; i < game.walls.length; i++) {
            this.addWall(game.walls[i].position, game.walls[i].wallType);
        }
    }


    showChessHint(position: cc.Vec2) {

    }

    clearChessHint() {

    }

    setChessPosition(chessNode: cc.Node, position: Position) {
        if (!position) {
            return;
        }
        let px = position.x * this.unit * 5 + this.unit * 2;
        let py = position.y * this.unit * 5 + this.unit * 2;
        chessNode.x = px;
        chessNode.y = py;
    }

    setChessView(chessNode: cc.Node, avatarUrl: string) {
        if (!chessNode) {
            return;
        }
        let head = chessNode.getChildByName('mask').getChildByName('chess')
        let headBG = head.getComponent(cc.Sprite);

        if (avatarUrl) {
            cc.loader.load({
                url: avatarUrl,
                type: 'jpg'
            }, function (err, texture) {
                if (err == null) {
                    headBG.spriteFrame = new cc.SpriteFrame(texture);
                }
                head.active = true;
            });
        } else {
            head.active = true;
        }
    }

    clearWall() {
        for (let i = 0; i < this.wallNodes.length; i++) {
            this.wallNodes[i].destroy();
        }
    }

    addWall(position: Position, wallType: WallType) {
        if (!position || !wallType) {
            return;
        }

        let wallNode: cc.Node;
        if (wallType == WallType.HORIZONTAL) {
            wallNode = cc.instantiate(this.hWall);
        } else if (wallType == WallType.VERTICAL) {
            wallNode = cc.instantiate(this.vWall);
        }

        this.wallNodes.push(wallNode);

        wallNode.parent = this.node;
        let px = position.x * this.unit * 5 + this.unit * 4.5;
        let py = position.y * this.unit * 5 + this.unit * 4.5;
        wallNode.x = px;
        wallNode.y = py;
    }


    listenChessBoard() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onChessTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onChessTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onChessTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onChessTouchCancel, this);
    }

    removeListenChessBoard() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onChessTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onChessTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onChessTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onChessTouchCancel, this);
    }

    onChessTouchStart(event) {
        console.log("onChessTouchStart");

        let worldPoint = event.getLocation();
        let startPoint = this.node.convertToNodeSpaceAR(worldPoint);


        this.touchWallShadowNode = cc.instantiate(this.hWallShadow);
        this.touchWallShadowNode.active = false;
        this.touchWallShadowNode.parent = this.node;

        this.touchWallNode = cc.instantiate(this.hWall);
        this.touchWallNode.active = false;
        this.touchWallNode.parent = this.node;
        // this.touchWallNode.position = startPoint;
        // this.touchWallNode.y += this.unit * 5;

        // 将锚点放置在0.75
        this.touchWallNode.anchorX = 0.75;

        this.touchWallType = WallType.HORIZONTAL;
        this.touchWallPosition = new Position(-1, -1);

        this.touchStartPosition = startPoint;
    }

    onChessTouchMove(event) {
        console.log("onChessTouchMove");

        let worldPoint = event.getLocation();
        let nowPoint = this.node.convertToNodeSpaceAR(worldPoint);

        if (Math.abs(nowPoint.x - this.touchStartPosition.x) < this.unit
            && Math.abs(nowPoint.y - this.touchStartPosition.y) < this.unit) {
            return;
        }


        // 将move的偏移量作用至wall
        this.touchWallNode.position = nowPoint;
        this.touchWallNode.y += this.unit * 10;
        this.touchWallNode.active = true;

        // 判断是否改变wall形状
        let tmp = (nowPoint.x + this.unit * 0.5) % (this.unit * 5);
        if (tmp > this.unit * 1.5) {
            tmp = this.unit * 5 - tmp;
        }

        if (tmp < this.unit * 1.2) {
            if (this.touchWallType == WallType.HORIZONTAL) {
                let action = cc.rotateTo(0.1, -90);
                this.touchWallNode.runAction(action);
                this.touchWallType = WallType.VERTICAL;

                this.touchWallShadowNode.destroy();
                this.touchWallShadowNode = cc.instantiate(this.vWallShadow);
                this.touchWallShadowNode.active = false;
                this.touchWallShadowNode.parent = this.node;
                this.touchWallShadowNode.setSiblingIndex(0);
            }
        } else {
            if (this.touchWallType == WallType.VERTICAL) {
                let action = cc.rotateTo(0.1, 0);
                this.touchWallNode.runAction(action);
                this.touchWallType = WallType.HORIZONTAL;

                this.touchWallShadowNode.destroy();
                this.touchWallShadowNode = cc.instantiate(this.hWallShadow);
                this.touchWallShadowNode.active = false;
                this.touchWallShadowNode.parent = this.node;
                this.touchWallShadowNode.setSiblingIndex(0);
            }
        }

        let x: number, y: number;
        if (this.touchWallType == WallType.HORIZONTAL) {
            x = (this.touchWallNode.position.x - this.unit * 4.5 - this.wallNodeWidth * 0.25) / (this.unit * 5);
            y = (this.touchWallNode.position.y - this.unit * 4.5) / (this.unit * 5);
        } else {
            x = (this.touchWallNode.position.x - this.unit * 4.5) / (this.unit * 5);
            y = (this.touchWallNode.position.y - this.unit * 4.5 + this.wallNodeWidth * 0.25) / (this.unit * 5);
        }
        x = Math.round(x);
        y = Math.round(y);

        if (x < 0 || x > 7 || y < 0 || y > 7) {
            this.touchWallShadowNode.active = false;
            this.touchWallPosition.x = -1;
            this.touchWallPosition.y = -1;
        } else {
            this.touchWallShadowNode.x = x * this.unit * 5 + this.unit * 4.5;
            this.touchWallShadowNode.y = y * this.unit * 5 + this.unit * 4.5;
            this.touchWallShadowNode.active = true;
            this.touchWallPosition.x = x;
            this.touchWallPosition.y = y;
        }
    }

    onChessTouchEnd(event) {
        console.log("onChessTouchEnd");
        console.log("-====", this.touchWallPosition);

        if (this.touchWallPosition.x != -1 && this.touchWallPosition.y != -1) {
            this.addWall(this.touchWallPosition, this.touchWallType);
        }

        this.touchWallNode.destroy();
        this.touchWallShadowNode.destroy();
    }

    onChessTouchCancel(event) {
        console.log("onChessTouchCancel");
        console.log("-====", this.touchWallPosition);

        if (this.touchWallPosition.x != -1 && this.touchWallPosition.y != -1) {
            this.addWall(this.touchWallPosition, this.touchWallType);
        }

        this.touchWallNode.destroy();
        this.touchWallShadowNode.destroy();
    }
}

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

    @property(cc.Prefab)
    hintPrefab: cc.Prefab = null;

    chessNodes: Array<cc.Node> = [];

    // 单位长度
    unit: number;
    // 横木板组件宽度
    wallNodeWidth: number;

    hintNodes: Array<cc.Node> = [];
    wallNodes: Array<cc.Node> = [];
    wallPositions: Array<cc.Vec2> = [];

    // 用于墙操作
    touchWallNode: cc.Node;
    touchWallShadowNode: cc.Node;
    touchWallType: WallType;
    touchWallPosition: Position;
    touchStartPosition: Position;
    isShowHint: boolean;

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
            let chessButton = this.chessNodes[i].getComponent(cc.Button);
            chessButton.interactable = false;
        }

        // this.chessNodes[0].on('click', this.onChessClick, this);

        let wallNode = cc.instantiate(this.hWall);
        this.wallNodeWidth = wallNode.getContentSize().width;

        this.isShowHint = false;
        this.listenChessBoard();
    }

    updateView(game: GameVO) {
        let playerCnt = Util.getPlayerCntByType(game.gameType);

        // 初始化棋子视图
        for (let i = 0; i < playerCnt; i++) {
            this.setChessView(this.chessNodes[i], game.playersInfo[i].avatarUrl);
            this.chessNodes[i].active = true;
            this.setChessPosition(this.chessNodes[i], game.playersInfo[i].chessPosition);
        }

        let chessButton = this.chessNodes[0].getComponent(cc.Button);
        chessButton.node.on('click', this.onChessClick, this);
        // 若当前玩家可走子，设置棋子可点击

        if (game.nowPlayerID == game.playersInfo[0].playerID) {
            this.listenChessBoard();
            chessButton.interactable = true;
        } else {
            this.removeListenChessBoard();
            chessButton.interactable = false;
        }

        // 更新棋子位置
        for (let i = 0; i < playerCnt; i++) {
            this.setChessPosition(this.chessNodes[i], game.playersInfo[i].chessPosition);
        }

        // 更新墙
        this.clearWall();

        for (let i = 0; i < game.walls.length; i++) {
            this.addWall(game.walls[i].position, game.walls[i].wallType);
        }
    }

    stopView() {
        this.removeListenChessBoard();
        let chessButton = this.chessNodes[0].getComponent(cc.Button);
        chessButton.interactable = false;
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

    moveChessCallback(position: Position) { }

    moveWallCallback(position: Position, wallType: WallType) { }

    getAllHintPosition(): any { }

    onChessClick(event, data) {
        if (this.isShowHint) {
            this.hideChessHint();
        } else {
            let positions = this.getAllHintPosition();
            this.showChessHint(positions);
        }
    }

    onChessHintClick(event, data) {
        let worldPoint = event.getLocation();
        let nowPoint = this.node.convertToNodeSpaceAR(worldPoint);
        let x = (nowPoint.x - this.unit * 2) / (this.unit * 5);
        let y = (nowPoint.y - this.unit * 2) / (this.unit * 5);
        x = Math.round(x);
        y = Math.round(y);
        if (x == -0) {
            x = 0;
        }
        if (y == -0) {
            y = 0;
        }
        if (x < 0 || x > 8 || y < 0 || y > 8) {
            x = -1;
            y = -1;
        }
        this.moveChessCallback(new Position(x, y));
        this.hideChessHint();
    }

    showChessHint(positions: Array<Position>) {
        if (!positions) {
            return;
        }

        this.hideChessHint();

        for (let i = 0; i < positions.length; i++) {
            let hintNode = cc.instantiate(this.hintPrefab);
            hintNode.parent = this.node;
            let px = positions[i].x * this.unit * 5 + this.unit * 2;
            let py = positions[i].y * this.unit * 5 + this.unit * 2;
            hintNode.x = px;
            hintNode.y = py;
            let hintButton = hintNode.getComponent(cc.Button);
            hintButton.interactable = true;
            // hintButton.node.on('click', this.onChessHintClick, this);

            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = "ChessboardView";// 这个是代码文件名
            clickEventHandler.handler = "onChessHintClick";
            clickEventHandler.customEventData = "";

            hintButton.clickEvents.push(clickEventHandler);

            this.hintNodes.push(hintNode);
        }
        this.isShowHint = true;
    }

    hideChessHint() {
        for (let i = 0; i < this.hintNodes.length; i++) {
            this.hintNodes[i].destroy();
        }
        this.hintNodes = [];
        this.isShowHint = false;
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

    clearWall() {
        for (let i = 0; i < this.wallNodes.length; i++) {
            this.wallNodes[i].destroy();
        }
        this.wallNodes = [];
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

    // 棋盘触控事件回调
    onChessTouchStart(event) {
        console.log("onChessTouchStart");

        // 获取当前触控坐标并转换为棋盘相对坐标
        let worldPoint = event.getLocation();
        let startPoint = this.node.convertToNodeSpaceAR(worldPoint);

        // 创建木板投影
        this.touchWallShadowNode = cc.instantiate(this.hWallShadow);
        this.touchWallShadowNode.active = false;
        this.touchWallShadowNode.parent = this.node;

        // 创建拖动木板
        this.touchWallNode = cc.instantiate(this.hWall);
        this.touchWallNode.active = false;
        this.touchWallNode.parent = this.node;

        // 将锚点放置在0.75，为了木板的横竖切换
        this.touchWallNode.anchorX = 0.75;

        // 初始化拖动木板的类型、坐标
        this.touchWallType = WallType.HORIZONTAL;
        this.touchWallPosition = new Position(-1, -1);

        // 记录起始触控坐标，用于防止误触
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

        if (tmp < this.unit * 1.3) {
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

        // 计算当前木板所在逻辑坐标
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
        if (x == -0) {
            x = 0;
        }
        if (y == -0) {
            y = 0;
        }

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

        if (this.touchWallPosition.x != -1 && this.touchWallPosition.y != -1) {
            this.moveWallCallback(this.touchWallPosition, this.touchWallType);
        }

        this.touchWallNode.destroy();
        this.touchWallShadowNode.destroy();
        this.hideChessHint();
    }

    onChessTouchCancel(event) {
        console.log("onChessTouchCancel");

        if (this.touchWallPosition.x != -1 && this.touchWallPosition.y != -1) {
            this.moveWallCallback(this.touchWallPosition, this.touchWallType);
        }

        this.touchWallNode.destroy();
        this.touchWallShadowNode.destroy();
        this.hideChessHint();
    }
}

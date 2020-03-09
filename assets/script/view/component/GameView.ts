import AppFacade from "../../AppFacade";
import GameViewMediator from "../GameViewMediator";
import { GameVO, Position, WallVO } from "../../model/vo/GameVO";
import Util from "../../util/Util";
import { GameType, WallType } from "../../Constants";
import UserProxy from "../../model/UserProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameView extends cc.Component {

    @property(cc.Node)
    chessBoardLayer: cc.Node = null;

    onLoad() {
    }

    start() {
        // AppFacade.getInstance().registerMediator(new GameViewMediator(this));

        let game = new GameVO(GameType.TEAM2);
        game.playersInfo[0].nickName = "hello";
        game.playersInfo[0].avatarUrl = "hello";
        game.playersInfo[0].chessPosition = new Position(5, 5);
        let wall = new WallVO(WallType.HORIZONTAL, new cc.Vec2(5, 5));
        game.walls.push(wall);

        this.initView(game);
    }

    public onDestroy() {
        // AppFacade.getInstance().removeMediator(GameViewMediator.NAME);
    }

    update(dt) {

    }

    initView(game: GameVO) {
        this.chessBoardLayer.getComponent("ChessboardView").initView(game);

        let playerCnt = Util.getPlayerCntByType(game.gameType);

        // 初始化用户信息
    }

    updateView(game: GameVO) {
        this.chessBoardLayer.getComponent("ChessboardView").updateView(game);
    }
}

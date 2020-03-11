import UserProxy from "../model/UserProxy";
import GameView from "../view/component/GameView";
import ChessBoardView from "./component/ChessboardView";
import { Position } from "../model/vo/GameVO";
import { WallType, GameNotification } from "../Constants";
import GameProxy from "../model/GameProxy";

export default class GameViewMediator extends puremvc.Mediator implements puremvc.IMediator {
    public static NAME: string = "GameViewMediator";

    public constructor(viewComponent: any) {
        super(GameViewMediator.NAME, viewComponent);
    }

    public listNotificationInterests(): string[] {
        return [
            GameNotification.GAME_START,
            GameNotification.GAME_UPDATE,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const viewComponent = this.viewComponent as GameView;
        const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;

        const data = notification.getBody();
        switch (notification.getName()) {
            case GameNotification.GAME_START: {
                break;
            }
            case GameNotification.GAME_UPDATE: {
                let game = gameProxy.getGame();
                viewComponent.updateView(game);
                console.log("更新游戏界面", game);
                break;
            }
        }
    }

    public onRegister(): void {
        // 启动帧同步
        const viewComponent = this.viewComponent as GameView;
        // const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;

        this.initView();
        this.initCallback();
    }

    public onRemove(): void {
    }

    public initView() {
        const viewComponent = this.viewComponent as GameView;
        const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;

        // 获取房间信息，初始化界面
        let game = gameProxy.getGame();
        viewComponent.updateView(game);
        console.log("初始化游戏界面", game);
    }

    public initCallback() {
        const viewComponent = this.viewComponent as GameView;
        const gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;
        let chessBoardVC = viewComponent.chessBoardLayer.getComponent("ChessboardView") as ChessBoardView;

        chessBoardVC.moveWallCallback = (position: Position, wallType: WallType) => {
            console.log("moveWallCallback", position, wallType);
            // chessBoardVC.addWall(position, wallType);
            gameProxy.addWall(position, wallType);
        };

        chessBoardVC.moveChessCallback = (position: Position) => {
            console.log("moveChessCallback", position);
            // 可以先修改界面，再同步后台，无论成功还是失败，都刷新即可
            gameProxy.moveChess(position);
        };
        chessBoardVC.getAllHintPosition = () => {
            let positions: Array<Position> = [];
            positions.push(new Position(1, 1));
            positions.push(new Position(2, 1));
            positions.push(new Position(3, 1));

            return positions;
        };

        viewComponent.leaveButtonClick = (event, data) => {
            console.log("leave button click");
            viewComponent.boxButtonNode.active = false;
        };
        viewComponent.giveupButtonClick = (event, data) => {
            console.log("giveup button click");
            viewComponent.boxButtonNode.active = false;
        };
        viewComponent.helpButtonClick = (event, data) => {
            console.log("help button click");
            viewComponent.boxButtonNode.active = false;
        };
    }
}
import AppFacade from "../../AppFacade";
import GameViewMediator from "../GameViewMediator";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameView extends cc.Component {

    // onLoad () {}

    start () {
        AppFacade.getInstance().registerMediator(new GameViewMediator(this));
    }

    public onDestroy() {
        AppFacade.getInstance().removeMediator(GameViewMediator.NAME);
    }

    update (dt) {

    }

    public set

}

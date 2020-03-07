import AppFacade from "../../AppFacade";
import WelcomeViewMediator from "../WelcomeViewMediator";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WelcomeView extends cc.Component {

    @property(cc.Node)
    popupLayer: cc.Node = null;


    start() {
        AppFacade.getInstance().registerMediator(new WelcomeViewMediator(this));
    }

    public onDestroy() {
        AppFacade.getInstance().removeMediator(WelcomeViewMediator.NAME);
    }

    update(dt) {

    }

}

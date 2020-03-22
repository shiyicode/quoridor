import { BaseUI } from "./BaseUI";
import WelcomeViewMediator from "../WelcomeViewMediator";
import AppFacade from "../../AppFacade";
import { ProjectConfig } from "../../Constants";


const { ccclass, property } = cc._decorator;

@ccclass
export class WelcomeView extends BaseUI {

    public static NAME = "WelcomeView";

    static getUrl():string {
        return ProjectConfig.PREFAB_UI_DIR + WelcomeView.NAME;
    }

    start() {
        AppFacade.getInstance().registerMediator(new WelcomeViewMediator(this));
    }

    public onDestroy() {
        AppFacade.getInstance().removeMediator(WelcomeViewMediator.NAME);
    }

    onLoad() {
    }

}
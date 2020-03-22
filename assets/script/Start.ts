const { ccclass, property } = cc._decorator;
import AppFacade from './AppFacade';
import { UIManager } from './manager/UIManager';
import { WelcomeView } from './view/component/WelcomeView';

@ccclass
export default class Start extends cc.Component {
    public onLoad() {
        this.initFrameSize();
    }

    public start() {
        AppFacade.getInstance().startup();
        this.loadStartView();
    }

    public update(dt: number) {
    }

    // 自适应屏幕适配
    private initFrameSize() {
        let frameSize = cc.view.getFrameSize();
        let bFitWidth = (frameSize.width / frameSize.height) < (750 / 1334);
        cc.Canvas.instance.fitWidth = bFitWidth;
        cc.Canvas.instance.fitHeight = !bFitWidth;
    }

    private loadStartView() {
        UIManager.getInstance().openUISync(WelcomeView, 10, () => {});
    }
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupView extends cc.Component {
    loadingNode: cc.Node = null;

    onLoad() {
        this.loadingNode = this.node.getChildByName("loading");
        this.loadingNode.active = false;
    }

    start() {
    }

    showLoading(isMask: boolean = false) {
        this.loadingNode.active = true;
        let loadBG: cc.Node = this.loadingNode.getChildByName("loadingBG");
        loadBG.active = isMask;
    }

    hideLoading() {
        this.loadingNode.active = false;
    }

    update(dt) {
        if (this.loadingNode.active) {
            this.rotateLoadingFrame();
        }
    }

    rotateLoadingFrame() {
        let rotationInc = 5;
        let loadingIcon = this.loadingNode.getChildByName('load_icon');

        loadingIcon.angle -= rotationInc;
    }
}
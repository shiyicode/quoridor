const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupView extends cc.Component {

    @property(cc.Node)
    loadingNode: cc.Node = null;

    onLoad() {
        // 旋转增量

    }

    start() {
        this.loadingNode.active = false;
    }

    showLoading() {
        this.loadingNode.active = true;
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
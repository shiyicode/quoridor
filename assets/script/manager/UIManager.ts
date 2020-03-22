import { BaseUI, UIClass } from "../view/component/BaseUI";
import { TipView } from "../view/component/TipView";
import { LoadingView } from "../view/component/LoadingView";


export class UIManager {
    private static instance: UIManager;
    private uiList: BaseUI[] = [];
    private uiRoot: cc.Node = null;

    public static getInstance(): UIManager {
        if (this.instance == null) {
            this.instance = new UIManager();
        }
        return this.instance;
    }

    constructor() {
        this.uiRoot = cc.find("Canvas");
    }

    public async showLoadingSync(isMask: boolean) {
        await this.openUISync(LoadingView, 201, (ui) => {
            ui.showLoading(isMask);
        });
    }

    public hideLoading() {
        let ui = UIManager.getInstance().getUI(LoadingView) as LoadingView;
        if (ui) {
            ui.hideLoading();
        }
    }

    public showTip(message: string) {
        this.openUISync(TipView, 200, (ui) => {
            ui.showTip(message);
        });
    }

    public async openUISync<T extends BaseUI>(uiClass: UIClass<T>, zOrder?: number, callback?: Function, onProgress?: Function, ...args: any[]) {
        let ui = this.getUI(uiClass);
        if (ui) {
            callback && callback(ui, args);
            return;
        }

        await this.loadResSync(uiClass.getUrl(), (completedCount: number, totalCount: number, item: any) => {
            if (onProgress) {
                onProgress(completedCount, totalCount, item);
            }
        }, (error, prefab) => {
            if (error) {
                cc.log(error);
                return;
            }
            ui = this.getUI(uiClass);
            if (ui) {
                callback && callback(ui, args);
                return;
            }
            let uiNode: cc.Node = cc.instantiate(prefab);
            uiNode.parent = this.uiRoot;
            //zOrder && uiNode.setLocalZOrder(zOrder);
            if (zOrder) { uiNode.zIndex = zOrder; }
            ui = uiNode.getComponent(uiClass) as BaseUI;
            ui.tag = uiClass;
            this.uiList.push(ui);

            callback && callback(ui, args);
        });
    }

    public closeUI<T extends BaseUI>(uiClass: UIClass<T>) {
        for (let i = 0; i < this.uiList.length; ++i) {
            if (this.uiList[i].tag === uiClass) {
                this.uiList[i].node.destroy();
                this.uiList.splice(i, 1);
                return;
            }
        }
    }

    public showUI<T extends BaseUI>(uiClass: UIClass<T>, callback?: Function) {
        let ui = this.getUI(uiClass);
        if (ui) {
            ui.node.active = true;
            ui.onShow();
            callback && callback(ui);
        }
        else {
            this.openUISync(uiClass, 0, () => {
                let ui = this.getUI(uiClass);
                ui.onShow();
                callback && callback(ui);
            });
        }
    }

    public hideUI<T extends BaseUI>(uiClass: UIClass<T>) {
        let ui = this.getUI(uiClass);
        if (ui) {
            ui.node.active = false;
        }
    }

    public getUI<T extends BaseUI>(uiClass: UIClass<T>): BaseUI {
        for (let i = 0; i < this.uiList.length; ++i) {
            if (this.uiList[i].tag === uiClass) {
                return this.uiList[i];
            }
        }
        return null;
    }

    public async loadResSync(url: string, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any) => void) | null): Promise<any> {
        return new Promise((resolve, reject) => {
            cc.loader.loadRes(url, progressCallback, (error, resource) => {
                completeCallback && completeCallback(error, resource);
                resolve();
            });
        });
    }

}
import { UserNotification } from "../Constants";
import UserProxy from "../model/UserProxy";
import GameView from "../view/component/GameView";

export default class GameViewMediator extends puremvc.Mediator implements puremvc.IMediator {
    public static NAME: string = "GameViewMediator";

    public constructor(viewComponent: any) {
        super(GameViewMediator.NAME, viewComponent);
    }

    public listNotificationInterests(): string[] {
        return [
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const data = notification.getBody();
        switch (notification.getName()) {

        }
    }

    public onRegister(): void {
        const viewComponent = this.viewComponent as GameView;
        // const userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;

        // viewComponent.setModeType(userProxy.getModeType());

        // let userInfo = userProxy.getUserInfo();
        // viewComponent.setUserInfo(userInfo.avatarUrl, userInfo.nickName);

        // viewComponent.mode2Button.node.on('click', (event) => {
        //     viewComponent.setModeType(4);
        //     userProxy.setModeType(4);
        // });
        // viewComponent.mode4Button.node.on('click', (event) => {
        //     viewComponent.setModeType(2);
        //     userProxy.setModeType(2);
        // });

    }

    public onRemove(): void {
    }
}
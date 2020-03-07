import { UserNotification, RoomNotification } from "../Constants";

export default class UserCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

    public constructor() {
        super();
    }

    public static NAME: string = 'UserCommand';

    /**
     * 注册消息
     */
    public register(): void {
        this.facade.registerCommand(UserNotification.AUTHORIZE, UserCommand);
    }

    public execute(notification: puremvc.INotification): void {
        const data: any = notification.getBody();
        switch (notification.getName()) {

        }
    }
}
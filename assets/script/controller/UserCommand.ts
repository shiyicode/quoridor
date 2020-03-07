export default class UserCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

    public constructor() {
        super();
    }

    public static NAME: string = 'UserCommand';

    /**
     * 注册消息
     */
    public register(): void {
    }

    public execute(notification: puremvc.INotification): void {
        const data: any = notification.getBody();
        switch (notification.getName()) {

        }
    }
}
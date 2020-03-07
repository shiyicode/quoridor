// import GameCommand from "../model/GameCommand";
import { GameNotification } from "../Constants";
// import { Platform } from "../services/platform/IPlatform";

export default class GameCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

    public constructor() {
        super();
    }

    public static NAME: string = 'GameCommand';

    /**
     * 注册消息
     */
    public register(): void {
    }

    public execute(notification: puremvc.INotification): void {
        const { gameType } = notification.getBody();
        switch (notification.getName()) {
        }
    }
}
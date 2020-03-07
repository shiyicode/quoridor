import UserProxy from './model/UserProxy';
import UserCommand from "./controller/UserCommand";
import RoomProxy from './model/RoomProxy';
import GameCommand from './controller/GameCommand';

export default class AppFacade extends puremvc.Facade implements puremvc.IFacade {
    public constructor() {
        super();
    }

    public static STARTUP = 'startup';

    static instance: AppFacade;

    public static getInstance(): AppFacade {
        if (AppFacade.instance == null) {
            AppFacade.instance = new AppFacade();
        }
        return <AppFacade>(AppFacade.instance);
    }

    // 启动pureMvc
    public startup() : void {
    }

    // 以下是该类的初始化函数，创建改类实例后会自动调用改函数
    public initializeFacade() : void {
        super.initializeFacade()
    }

    // 注册数据模型
    public initializeModel(): void {
        super.initializeModel();

        this.registerProxy(new UserProxy());
        this.registerProxy(new RoomProxy());
    }

    // 注册控制器
    public initializeController(): void {
        super.initializeController();

        (new UserCommand()).register();
        (new GameCommand()).register();
    }

    // 注册View视图
    public initializeView(): void {
        super.initializeView();
    }
}
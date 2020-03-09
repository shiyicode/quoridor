export enum WorldNotification {
    ACTION_LAUNCH = "ACTION_LAUNCH",
    SHOW_LOADING = "SHOW_LOADING",
    HIDE_LOADING = "HIDE_LOADING",
    SHOW_TIPS = "SHOW_TIPS",

}

export enum UserNotification {
    AUTHORIZE = "AUTHORIZE",
    AUTHORIZE_SUCC = "AUTHORIZE_SUCC",
    AUTHORIZE_FAIL = "AUTHORIZE_FAIL",
}

// TODO 很多FAIL可以考虑用SHOW_TIPS代替
export enum RoomNotification {
    ROOM_CREATE_SUCC = "ROOM_CREATE_SUCC",
    ROOM_CREATE_FAIL = "ROOM_CREATE_FAIL",

    ROOM_JOIN_SUCC = "ROOM_JOIN_SUCC",
    ROOM_JOIN_FAIL = "ROOM_JOIN_FAIL",

    ROOM_LEAVE_SUCC = "ROOM_LEAVE_SUCC",
    ROOM_LEAVE_FAIL = "ROOM_LEAVE_FAIL",

    ROOM_RETURN_CHECK = "ROOM_RETURN_CHECK",  // 提示是否返回当前房间
    ROOM_RETURN_NOT_CHECK = "ROOM_RETURN_NOT_CHECK",  // 不需要提示

    ROOM_UPDATE = "ROOM_UPDATE",
}

export enum GameNotification {
}

export enum GameType {
    TEAM2 = "team2",
    MATCH2 = "match2",
    MACHINE2 = "machine2",
    TEAM4 = "team4",
    MATCH4 = "match4",
    MACHINE4 = "machine4",
}

export enum WallType {
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical",
}

export enum Scene {
    WELCOME = "welcome",
    MENU = "menu",
    ROOM = "room",
    GAME = "game",
}

export const Config = {
    WXCloudEnvID: "dev-620e72", // 开发环境ID

    MGOBEGameId: "obg-fqdy9jzs", // 替换为控制台上的“游戏ID”
    MGOBESecretKey: 'edb151a57fbbbd59f1c81399d8a5773aa40aee21',// 替换为控制台上的“游戏key”
    MGOBEHost: 'fqdy9jzs.wxlagame.com',

    reconnectMaxTimes: 5,      // 最大重试次数
    reconnectInterval: 1000,   // 重试间隔
    resendInterval: 1000,      // 重发间隔
    resendTimeout: 10000,      // 重发超时时间
    isDebug: false,            // 是否debug模式
}
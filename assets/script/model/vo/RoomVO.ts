import { GameType } from "../../Constants";

export class RoomVO {
    roomId : string;

    gameType: GameType;

    playersInfo: Array<PlayerVO> = [];

    public constructor() {
        for (let i = 0; i < 4; i++) {
            this.playersInfo.push(new PlayerVO());
        }
    }
}

export class PlayerVO {
    playerID: string;
    isReady: boolean;
    avatarUrl: string;
    nickName: string;
}
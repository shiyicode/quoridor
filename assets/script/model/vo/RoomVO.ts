import { GameType } from "../../Constants";
import { GameVO, PlayerVO } from "./GameVO";

export class RoomVO {
    roomId : string;

    mePlayerIdx: number;

    gameType: GameType;

    playersInfo: Array<PlayerVO> = [];

    public constructor() {
        for (let i = 0; i < 4; i++) {
            this.playersInfo.push(new PlayerVO());
        }
    }
}

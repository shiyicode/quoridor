import { GameType, RoomStatus } from "../../Constants";
import { GameVO, PlayerVO } from "./GameVO";

export class RoomVO {
    roomId : string;

    mePlayerIdx: number;

    gameType: GameType;

    status: RoomStatus;

    playersInfo: Array<PlayerVO> = [];

    public constructor() {
    }
}

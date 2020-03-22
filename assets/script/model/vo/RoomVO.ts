import { GameType, RoomStatus, RoomStartAction } from "../../Constants";
import { GameVO, PlayerVO } from "./GameVO";

export class RoomVO {
    roomId : string;

    mePlayerIdx: number;

    gameType: GameType;

    status: RoomStatus;

    playersInfo: Array<PlayerVO> = [];

    startAction: RoomStartAction;

    public constructor() {
    }
}

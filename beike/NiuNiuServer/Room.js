const GameConfig = require('./GameConfig');
class Room {
    constructor(id, data) {
        console.log("创建游戏规则", JSON.stringify(data));
        // {"roundCountType":"round-count-10",
        // "bankerType":"banker-type-1",
        // "kouType":"kou-type-1",
        // "rateType":"rate-type-0"}
        console.log("Game Config", JSON.stringify(GameConfig))
        let roomConfig = GameConfig.RoomConfig;
        this._id = id;
        let roundCountType = data.roundCountType;
        let bankerType = data.bankerType;
        let kouType = data.kouType;
        let rateType = data.rateType;

        let roundCount = roomConfig.rountCount[roundCountType];
        console.log("round count", roundCount);
        let kouCount = roomConfig.kouCount[kouType];
        console.log("kou count", kouCount);
        let rateCountMap = roomConfig.rateMap[rateType];
        console.log("rate count =", JSON.stringify(rateCountMap));
        

    }
    getId() {
        return this._id;
    }
}
module.exports = Room;
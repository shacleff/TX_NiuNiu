const Config = require('./GameConfig')
class Room {
    constructor(id, data){
        console.log("创建了新房间 id= ", id);
        console.log("参数=", JSON.stringify(data));
        let roomConfig = Config.RoomConfig;
        this._id = id;
        this._bankerType = data.bankerType;
        this._roundCount = roomConfig.RoundCount[data.roundCountType];
        this._kouCount = roomConfig.kouCount[data.kouType];
        this._rateConfig = roomConfig.rateConfig[data.rateType];
        console.log("round count = ", this._roundCount);
        console.log("kou count = ", this._kouCount);
        console.log("rate config = ", JSON.stringify(this._rateConfig));
        this._state = 'wait';
    }
    getId(){
        return this._id;
    }
    isCanJoin(){
        if (this._state !== 'wait'){
            return '游戏已经开始了，不能在加入了'
        }else{
            return true;
        }
    }
    getRoomInfo(){
        return {
            roundCount: this._roundCount,
            rateConfig: this._rateConfig,
            kouCount: this._kouCount,
            bankerType: this._bankerType
        }
    }
    joinRoom(player){
        console.log("玩家加入房间成功", player.getId());
    }
}
module.exports = Room;
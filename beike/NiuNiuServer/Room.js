const Config = require('./GameConfig')
class Room {
    constructor(id, data) {
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
        this._playerList = [];
    }
    getId() {
        return this._id;
    }
    addPlayer(player) {
        this._playerList.push(player);
        // this._playerList[0].
        this.updateHouseMaster();
        player.setCurrentRoom(this);
    }
    updateHouseMaster(){
        for (let i = 0 ; i < this._playerList.length ; i ++){
            let player  = this._playerList[i];
            if (i === 0){
                player.setHouseMaster(true)
            }else{
                player.setHouseMaster(false);
            }
        }
    }
    getRoomInfo() {
        // let playersInfo = [];
        // for (let i = 0 ; i < this._playerList.length ; i ++){
        //     let info = this._playerList[i].getPlayerInfo();
        //     playersInfo.push(info);
        // }

        let roomInfo = {
            roomId: this._id,
            roundCount: this._roundCount,
            kouCount: this._kouCount,
            rateConfig: this._rateConfig,
            bankerType: this._bankerType
            // ,
            // playersInfo: playersInfo
        }
        return roomInfo
    }
    isCanJoin() {
        if (this._state === 'wait') {
            return true
        } else {
            return '房间已经开始，不允许在加入';
        }
    }
    syncAllPlayerInfo(){
        let playerInfoList = [];
        for (let i = 0 ; i < this._playerList.length ; i ++){
            let playerInfo = this._playerList[i].getPlayerInfo();
            playerInfoList.push(playerInfo);
        }
        for (let i = 0 ; i < this._playerList.length ; i ++){
            let player = this._playerList[i];
            player.sendMessage("sync-all-player-info", playerInfoList, 0);
        }

    }
    playerExitRoom(player){
        let exitResult = '玩家未在房间里面';
        for (let i = 0 ; i < this._playerList.length ; i ++){
            let target = this._playerList[i];
            if (player.getId() === target.getId()){
                this._playerList.splice(i, 1);
                exitResult = true;
                break;
            }
        }
        this.updateHouseMaster();
        return exitResult;
    }
}
module.exports = Room;
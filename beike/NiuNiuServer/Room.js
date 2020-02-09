const Config = require('./GameConfig')
const CardController  = require('./CardController')
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
        let isHave = false;
        for (let i = 0 ; i < this._playerList.length ; i ++){
            if (player.getId() === this._playerList[i].getId()){
                isHave = true;
            }
        }
        if (!isHave){
            this._playerList.push(player);
            player.setCurrentRoom(this);
        }
       
        this.updateHouseMaster();
    }
    updateHouseMaster() {
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            if (i === 0) {
                player.setHouseMaster(true)
            } else {
                player.setHouseMaster(false);
            }
        }
    }
    getRoomInfo() {
        // let playersInfo = [];
        // for (let i = 0 ; i < this._playerList.length ; i ++){
        //     let info = this._playerList[i].getPlayerInfo();  
        // }

        let roomInfo = {
            roomId: this._id,
            roundCount: this._roundCount,
            kouCount: this._kouCount,
            rateConfig: this._rateConfig,
            bankerType: this._bankerType,
            state: this._state
            // ,
            // playersInfo: playersInfo
        }
        return roomInfo
    }
    isCanJoin(player) {
        if (this._state === 'wait') {
            return true
        } else {

            for (let i = 0 ; i < this._playerList.length ; i ++){
                if (this._playerList[i].getId() === player.getId()){
                    return true;
                }
            }

            return '房间已经开始，不允许在加入';
        }
    }
    syncAllPlayerInfo() {
        let playerInfoList = [];
        for (let i = 0; i < this._playerList.length; i++) {
            let playerInfo = this._playerList[i].getPlayerInfo();
            playerInfoList.push(playerInfo);
        }
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            player.sendMessage("sync-all-player-info", playerInfoList, 0);
        }

    }
    playerExitRoom(player) {
        let exitResult = '玩家未在房间里面';
        for (let i = 0; i < this._playerList.length; i++) {
            let target = this._playerList[i];
            if (player.getId() === target.getId()) {
                this._playerList.splice(i, 1);
                exitResult = true;
                break;
            }
        }
        this.updateHouseMaster();
        return exitResult;
    }
    playerRequestStartGame(player) {
        let result = true;

        if (player.getId() !== this._playerList[0].getId()) {
            result = "你不是房主，无法开始游戏！";
        }
        if (this._state !== 'wait') {
            result = '游戏已经开始，不能再次开始！';
        }

        this._state = 'starting';
        this.startGame();
        return result;
    }
    startGame() {
        this.changeBanker();
        this.pushCard();
    }
    pushCard(){
        this._cardList = CardController.getNewPackCard();
        for (let i = 0 ; i < this._playerList.length ; i ++){
            let player = this._playerList[i];
            let handCardList = [];
            for (let i = 0 ; i < 5 ; i ++){
                handCardList.push(this._cardList.pop());
            }
            player.sendPushCardMessage(handCardList, this._kouCount);
        }
    }
    changeBanker() {
        let currentBankerIndex = -1;
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            if (player.getIsBanker()) {
                currentBankerIndex = i;
            }
        }

        switch (this._bankerType) {
            case 'banker-type-0':
                //连庄
                break;
            case 'banker-type-1':
                //轮庄
                currentBankerIndex++;
                if (currentBankerIndex === this._playerList.length) {
                    currentBankerIndex = 0;
                }

                break;
            case 'banker-type-2':
                //霸王庄
                currentBankerIndex = 0;
                break;
        }
        for (let i = 0; i < this._playerList.length; i++) {
            this._playerList[i].setBanker(false);
        }
        this._playerList[currentBankerIndex].setBanker(true);
        let id = this._playerList[currentBankerIndex].getId();
        for (let i = 0 ; i < this._playerList.length ; i ++){
            let player = this._playerList[i];
            player.sendMessage('change-banker', {bankerId: id}, 0);
        }
    }
    syncRoomState() {
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            player.sendMessage("sync-room-state", this._state, 0);
        }
    }
}
module.exports = Room;
class Player {
    constructor(id, spec){
        this._id = id;
        console.log("新创建的玩家", this._id);
        this._nickName = spec.nickname;
        this._housecardCount = spec.housecard_count;
    }
    getId(){
        return this._id;
    }
    reConnect(){
        console.log("断线重连", this._id);
    }
    getPlayerInfo(){
        return {
            id: this._id,
            nickname: this._nickName,
            housecard_count: this._housecardCount
        }
    }
}
module.exports = Player
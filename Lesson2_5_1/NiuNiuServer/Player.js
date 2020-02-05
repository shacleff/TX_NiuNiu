class Player {
    constructor(id, spec, client){
        this._id = id;
        console.log("新创建的玩家", this._id);
        this._nickName = spec.nickname;
        this._housecardCount = spec.housecard_count;
        this._client = client;
        this.resgisterMessage(client);
    }
    resgisterMessage(client){
        console.log("注册消息");
        client.on("text", (result)=>{
            console.log("玩家发来了消息", JSON.stringify(result));
        });
    }
    getId(){
        return this._id;
    }
    reConnect(client){
        console.log("断线重连", this._id);
        this._client = client;
        this.resgisterMessage(client);
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
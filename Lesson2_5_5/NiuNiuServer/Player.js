class Player {
    constructor(id, spec, client, controller) {
        this._id = id;
        console.log("新创建的玩家", this._id);
        this._nickName = spec.nickname;
        this._housecardCount = spec.housecard_count;
        this._client = client;
        this._controller = controller;
        this.resgisterMessage(client);
    }
    resgisterMessage(client) {
        console.log("注册消息");
        client.on("text", (result) => {
            console.log("玩家发来了消息", JSON.stringify(result));
            let messgae = JSON.parse(result);
            let type = messgae.type;
            let data = messgae.data;
            let callBackId = messgae.callBackId;
            switch (type) {
                case 'create-room':
                    this._controller.getRoomController().createRoom(data).then((roomId)=>{
                        console.log("create room success");
                        // this._client.send(JSON.stringify({
                        //     type: type,
                        //     data : {
                        //         roomId: roomId
                        //     },
                        //     callBackId: callBackId
                        // }))
                        this.sendMessage(type, {roomId: roomId}, callBackId);
                    });
                    break;
                case 'join-room':
                    console.log("客户端发来了 ，加入房间的消息 ", JSON.stringify(data));
                    this._controller.getRoomController().requestJoinRoom(data.roomId).then((result)=>{
                        console.log("加入房间成功", JSON.stringify(result));
                        this.sendMessage(type, '加入房间成功', callBackId);
                    }).catch((err)=>{
                        console.log("加入房间失败", err);
                        this.sendMessage(type,{err: err}, callBackId);
                    });
                    break;    
                default:
                    break;
            }
        });
    }
    getId() {
        return this._id;
    }
    reConnect(client) {
        console.log("断线重连", this._id);
        this._client = client;
        this.resgisterMessage(client);
    }
    getPlayerInfo() {
        return {
            id: this._id,
            nickname: this._nickName,
            housecard_count: this._housecardCount
        }
    }
    sendMessage(type, data, callBackId){
        this._client.send(JSON.stringify({
            type: type,
            data : data,
            callBackId: callBackId
        }))
    }
}
module.exports = Player
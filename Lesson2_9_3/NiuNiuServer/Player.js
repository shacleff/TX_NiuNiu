class Player {
    constructor(id, spec, client, controller) {
        this._id = id;
        console.log("新创建的玩家", this._id);
        this._nickName = spec.nickname;
        this._housecardCount = spec.housecard_count;
        this._client = client;
        this._headImageUrl = spec.head_image_url;
        this._controller = controller;
        this._room = undefined;
        this._isHouseMaster = false; //是不是房主
        this._isBanker = false;
        this.resgisterMessage(client);
    }
    setBanker(value) {
        this._isBanker = value;
    }
    getIsBanker() {
        return this._isBanker;
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
                    this._controller.getRoomController().createRoom(data).then((roomId) => {
                        console.log("create room success");
                        // this._client.send(JSON.stringify({
                        //     type: type,
                        //     data : {
                        //         roomId: roomId
                        //     },
                        //     callBackId: callBackId
                        // }))
                        this.sendMessage(type, { roomId: roomId }, callBackId);
                    });
                    break;
                case 'join-room':
                    console.log("客户端发来了 ，加入房间的消息 ", JSON.stringify(data));
                    this._controller.getRoomController().requestJoinRoom(data.roomId, this).then((result) => {
                        console.log("加入房间成功", JSON.stringify(result));
                        this.sendMessage(type, '加入房间成功', callBackId);
                    }).catch((err) => {
                        console.log("加入房间失败", err);
                        this.sendMessage(type, { err: err }, callBackId);
                    });
                    break;
                case 'request-room-info':
                    //
                    let roomInfo = this._room.getRoomInfo();
                    this.sendMessage(type, roomInfo, callBackId);
                    this._room.syncAllPlayerInfo();
                    break;
                case 'exit-room':
                    let exitResult = this._room.playerExitRoom(this);
                    console.log("退出房间", exitResult);
                    if (exitResult === true) {
                        this.sendMessage(type, exitResult, callBackId);
                        this._room.syncAllPlayerInfo();
                        this._room = undefined;
                    } else {
                        this.sendMessage(type, { err: exitResult }, callBackId);
                    }
                    break;
                case 'requet-start-game':
                    let startResult = this._room.playerRequestStartGame(this);
                    if (startResult === true) {
                        this.sendMessage(type, startResult, callBackId);
                        this._room.syncRoomState();
                    } else {
                        this.sendMessage(type, { err: startResult }, callBackId);
                    }
                    break;
                default:
                    break;
            }
        });
    }
    setHouseMaster(value) {
        this._isHouseMaster = value;
    }
    setCurrentRoom(room) {
        this._room = room;
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
            housecard_count: this._housecardCount,
            headImageUrl: this._headImageUrl,
            isHouseMaster: this._isHouseMaster
        }
    }
    sendPushCardMessage(handCardList, kouCount) {
        if (!this._isBanker) {
            for (let i = 0; i < kouCount; i++) {
                handCardList[handCardList.length - 1 - i].setShow(false);
            }
        }
        let cardInfoList = [];
        for (let i = 0 ; i < handCardList.length ; i ++){
            cardInfoList.push(handCardList[i].getInfo());
        }
        this.sendMessage('push-card', cardInfoList, 0);
    }
    sendMessage(type, data, callBackId) {
        this._client.send(JSON.stringify({
            type: type,
            data: data,
            callBackId: callBackId
        }))
    }
}
module.exports = Player
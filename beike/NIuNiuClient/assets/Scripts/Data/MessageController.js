//负责接收发送跟服务端通讯的所有操作
class MessageController {
    constructor(){
        this._callBackId = 1;
        this._callBackMap = {};
    }
    connectServer(){
        console.log("请求链接服务器");
        return new Promise((resole, reject)=>{
            let ws = new WebSocket("ws://47.105.205.9:3001");
            ws.onopen = function (result) {
                console.log("on open ", result);
                resole();
                // let data = {
                //     type: 'login',
                //     data: {
                //         id: 10000
                //     }
                // }
                // ws.send(JSON.stringify(data));
            }
            ws.onmessage = function (result) {
                console.log("on message", result.data);
    
                let message = JSON.parse(result.data);
                let type = message.type;
                let data = message.data;
                let callBackId = message.callBackId;
                this.processMessage(type, data, callBackId);
                // if (type === 'login_success') {
                //     let data = message.data;
                //     this._playerNode.emit('login-success', data);
                // }
            }.bind(this);
            ws.onerror = function (result) {
                console.log("on error", result);
                reject();
            }
            this._ws = ws;
        });
    }
    processMessage(type, data, callBackId){
        let cb = this._callBackMap[callBackId];
        cb(data);
    }
    login(id){
        return new Promise((resole, reject)=>{
            this.sendMessage('login', {
                id: id
            }, (result)=>{
                console.log("send Message Success", result);
                if (result.err){
                    reject(result.err);
                }else{
                    resole(result);

                }
            });
        });
    }
    sendCreateRoomMessage(data){
        return new Promise((resole, reject)=>{
            this.sendMessage(
                'create-room',
                data, 
                (result)=>{
                    // console.log("创建房间成功")
                    resole(result);
                }
            )
        });
       
    }
    sendJoinRoomMessage(roomId){
        return new Promise((resole, reject)=>{
            this.sendMessage(
                'join-room',
                {
                    roomId: roomId
                },
               (result)=>{
                    if (result.err){
                        reject(result.err)
                    }else{
                        resole(result);
                    }
               }
            )
        });
    }
    sendRequestRoomInfoMessage(){
        return new Promise((resole)=>{
            this.sendMessage(
                'request-room-info',
                '',
                resole
            )
        });
    }
    sendMessage(type, data, cb){
        let message = {
            type: type,
            data: data,
            callBackId: this._callBackId
        }
        this._callBackMap[this._callBackId] = cb;
        this._ws.send(JSON.stringify(message));
        this._callBackId ++;
    }
}
export default MessageController;
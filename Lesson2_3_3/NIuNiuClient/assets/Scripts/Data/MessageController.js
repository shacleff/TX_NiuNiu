//负责接收发送跟服务端通讯的所有操作
class MessageController {
    constructor(){

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
                if (type === 'login_success') {
                    let data = message.data;
                    this._playerNode.emit('login-success', data);
                }
            }.bind(this);
            ws.onerror = function (result) {
                console.log("on error", result);
                reject();
            }
        });
    }
}
export default MessageController;
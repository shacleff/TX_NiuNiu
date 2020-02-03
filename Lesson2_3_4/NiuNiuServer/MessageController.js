class MessageController {
    constructor(db) {
        this._db = db;
    }
    receivedMessage(type, data, callBackId, client) {
        switch (type) {
            case 'login':
                this.processLogin(data, callBackId, client);
                break;
            default:
                break;
        }
    }
    processLogin(data, callBackId, client){
        this._db.getUserInfo(data.id).then((result)=>{
            this.sendMessage("login",client, callBackId, result[0]);
        });
    }
    sendMessage(type,client, callBackId, data){
        let result = {
            type: type, 
            data: data,
            callBackId: callBackId
        }
        client.send(JSON.stringify(result));
    }

}
module.exports = MessageController;
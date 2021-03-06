class MessageController {
    constructor(db, roomController, playerController) {
        this._db = db;
        this._roomController = roomController;
        this._playerController = playerController;
    }
    receivedMessage(type, data, callBackId, client) {
        switch (type) {
            case 'login':
                this.processLogin(data, callBackId, client);
                break;
            case 'create-room':
                this.processCreateRoom(data, callBackId, client)
                break;    
            default:
                break;
        }
    }
    processCreateRoom(data, callBackId, client){
        this._roomController.createRoom(data).then(()=>{
            
        });
    }
    processLogin(data, callBackId, client){
        this._playerController.playerLogin(data.id).then((result)=>{
            this.sendMessage("login",client, callBackId, result);
        });
        // this._db.getUserInfo(data.id).then((result)=>{
        //     this.sendMessage("login",client, callBackId, result[0]);
        // });
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
const ws = require("nodejs-websocket")
let MessageController = require('./MessageController')
let RoomController = require('./RoomController')
let PlayerController = require('./PlayerController')
let DB = require('./db');
let db = new DB();
let roomController = new RoomController();
let playerController = new PlayerController(db);
let messageController = new MessageController(db, roomController, playerController);
let websocket = ws.createServer(function(client){
    console.log("new client connect");
    client.on("text", (result)=>{
        console.log("receive message", result);
        let message = JSON.parse(result);
        let type = message.type;
        let data = message.data;
        let callBackId = message.callBackId;
        messageController.receivedMessage(type, data, callBackId, client);


        // let message = JSON.parse(result);
        // let type = message.type;
        // let data = message.data;
        // console.log("type", type);
        // console.log("data", JSON.stringify(data));
        // db.getUserInfo(data.id).then((result)=>{
        //     // [{"id":10000,"nickname":"Andy","housecard_count":5}]
        //     // console.log("result", JSON.stringify(result));
        //     client.send(JSON.stringify( {
        //         type: 'login_success',
        //         data: result[0]
        //     }));
        // }).catch((err)=>{
        //     console.log('err = ', err);
        // });
    });
    client.on("close", (result)=>{
        console.log("on close ", result);
    });
    client.on("error", (result)=>{
        console.log("on error", result);
    });
});
websocket.listen(3001);
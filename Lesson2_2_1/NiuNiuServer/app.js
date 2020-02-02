const ws = require("nodejs-websocket")
let websocket = ws.createServer(function(client){
    console.log("new client connect");
    client.on("text", (result)=>{
        console.log("receive message", result);
        client.send("ok hello world");
    });
    client.on("close", (result)=>{
        console.log("on close ", result);
    });
    client.on("error", (result)=>{
        console.log("on error", result);
    });
});
websocket.listen(3000);
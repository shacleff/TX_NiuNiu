const ws = require("nodejs-websocket");
let server = ws.createServer((client)=>{
    client.on("text", function(result){
        console.log('result = ', JSON.stringify(result));
        if (result === 'hello world'){
            console.log("return message")
            client.send("ok hello world");
        }
    });
    client.on('connect', function(code){
        console.log("开启链接", code);
    });
    client.on("close", function(code){
        console.log("关闭连接", code);
    });
    client.on("error", function(code){
        console.log("链接错误",code);
    });
});

server.listen(3003);
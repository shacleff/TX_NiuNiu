cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad () {
        let ws = new WebSocket('ws://47.104.67.84:3003');
        ws.onopen = function(result){
            console.log("websocket contented", result)
            ws.send("hello world");
        }
        ws.onmessage = function(result){
            let data = result.data;
            console.log("on message",data)
        }
        ws.onerror = function(result){
            console.log("onerror", result)
        }
        
    },
    start () {

    }
});

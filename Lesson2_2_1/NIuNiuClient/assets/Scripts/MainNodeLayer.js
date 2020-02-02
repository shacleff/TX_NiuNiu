
cc.Class({
    extends: cc.Component,

    properties: {
  
    },
    onLoad () {
        let ws = new WebSocket("ws://47.105.205.9:3000");
        ws.onopen = function(result){
            console.log("on open ", result);
            ws.send("hello world");
        }
        ws.onmessage = function(result){
            console.log("on message", result.data);
        }
        ws.onerror = function(result){
            console.log("on error", result);
        }
    },
    onButtonClick(event, customData){
        console.log("custom ", customData);
    },

    start () {

    },

    update (dt) {}
});

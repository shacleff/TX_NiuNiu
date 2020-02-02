
cc.Class({
    extends: cc.Component,

    properties: {
        playerNodePrefab: cc.Prefab,
        healthGameTipLabel: cc.Node
    },
    onLoad () {
        let playerNode = cc.instantiate(this.playerNodePrefab);
        playerNode.parent = this.node;
        // playerNode.x = 
        playerNode.x = cc.view.getVisibleSize().width * -0.5 + playerNode.width * 0.5 + 20;
        playerNode.y = cc.view.getVisibleSize().height * 0.5 - playerNode.height * 0.5 - 20;
        this._playerNode = playerNode;
        let ws = new WebSocket("ws://47.105.205.9:3001");
        ws.onopen = function(result){
            console.log("on open ", result);
            let data = {
                type: 'login',
                data: {
                    id: 10000
                }
            }
            ws.send(JSON.stringify(data));
        }
        ws.onmessage = function(result){
            console.log("on message", result.data);

            let message = JSON.parse(result.data);
            let type = message.type;
            if (type === 'login_success'){
                let data = message.data;
                this._playerNode.emit('login-success', data);
            }
        }.bind(this);
        ws.onerror = function(result){
            console.log("on error", result);
        }
       this.healthGameTipLabel.runAction(
           cc.repeatForever(
               cc.sequence(
                   cc.moveTo(15, -1200, 0),
                   cc.callFunc(()=>{
                       this.healthGameTipLabel.x = 1200;
                   })
               )
           )
       )
       
    },
    onButtonClick(event, customData){
        console.log("custom ", customData);
    },

    start () {

    },

    update (dt) {}
});

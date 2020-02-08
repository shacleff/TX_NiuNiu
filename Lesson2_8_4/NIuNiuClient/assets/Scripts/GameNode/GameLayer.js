import global from "../global";

cc.Class({
    extends: cc.Component,

    properties: {
        roomIdLabel: cc.Node,
        roundCountLabel: cc.Node,
        kouCountLabel: cc.Node,
        bankerTypeLabel: cc.Node,
        rateConfigLabel: cc.Node,
        GameConfig: cc.JsonAsset,
        gamePlayerNodePrefab: cc.Prefab,
        startGameButton: cc.Node
    },
    onLoad() {
        this._playerNodeList = [];
        this._roomState = undefined;
        global.messageController.onSyncAllPlayerInfo = this.syncAllPlayerInfo.bind(this);
        global.messageController.onSyncRoomState = this.syncRoomState.bind(this);
    },
    syncRoomState(data){
        this._roomState = data;
        console.log("同步到了房间的状态是", this._roomState);
    },
    syncAllPlayerInfo(data) {
        let count = data.length - this._playerNodeList.length;
        if (count > 0) {
            let length = this._playerNodeList.length;
            for (let i = 0; i < count; i++) {
                let info = data[length + i];
                this.addPlayerNode(info, length + i);
            }
        }

        if (count < 0) {
            for (let i = 0; i < Math.abs(count); i++) {
                let node = this._playerNodeList.pop();
                node.destroy();
            }
        }
        let selfIndex = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === global.playerData.getID()) {
                selfIndex = i;
            }
        }

        for (let i = 0; i < this._playerNodeList.length; i++) {
            let playerNode = this._playerNodeList[i];
            playerNode.emit("update-info",data[i], i, selfIndex, this._playerNodeList.length);
        }

        if (data[0].id === global.playerData.getID() && data.length > 1){
            this.startGameButton.active = true;
        }else{
            this.startGameButton.active = false;

        }
    },

    start() {
        global.messageController.sendRequestRoomInfoMessage().then((result) => {
            console.log("请求房间信息成功", result);
            this.roomIdLabel.getComponent(cc.Label).string = "房间号：" + result.roomId;
            this.roundCountLabel.getComponent(cc.Label).string = "总局数:" + result.roundCount + " 当前局数:0"
            this.kouCountLabel.getComponent(cc.Label).string = "扣牌的个数:" + result.kouCount;
            console.log("game config = ", this.GameConfig);
            let BankerNameConfig = this.GameConfig.json.BankerNameConfig;
            this.bankerTypeLabel.getComponent(cc.Label).string = "坐庄类型:" + BankerNameConfig[result.bankerType];
            let NiuNiuNameConfig = this.GameConfig.json.NiuNiuNameConfig;
            let rateStr = "倍数:";
            for (let i in NiuNiuNameConfig) {
                let value = result.rateConfig[i];
                let name = NiuNiuNameConfig[i]
                rateStr += name + 'X' + value;
            }
            this.rateConfigLabel.getComponent(cc.Label).string = rateStr;
            // let playersInfo = result.playersInfo; 
            // for (let i = 0 ; i < playersInfo.length ; i ++){
            //     let info = playersInfo[i];
            //     this.addPlayerNode(info, i);
            // }
        })
    },
    addPlayerNode(info, index) {
        let node = cc.instantiate(this.gamePlayerNodePrefab);
        node.parent = this.node;
        node.emit("init-player-node", info, index);
        this._playerNodeList.push(node);
    },
    onButtonClick(event, customData) {
        switch (customData) {
            case "exit-room":
                console.log("玩家点击了退出房间的按钮");
                global.messageController.sendExitRoomMessage().then((result)=>{
                    console.log("退出房间成功", result);
                    global.controller.enterMainNodeLayer();
                }).catch((err)=>{
                    console.log("退出房间异常", err);
                });
                break;
            case "start-game":
                console.log("开始游戏");
                global.messageController.sendRequesrStartGameMessage().then(()=>{
                    this.startGameButton.active = false;
                }).catch(()=>{

                })
                break;    
            default:
                break;
        }
    },
    update(dt) { }
});

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
        startGameButton: cc.Node,
        cardPrefab: cc.Prefab,
        upScorePrefab: cc.Prefab
    },
    onLoad() {
        this._currentPlayerScore = 0;
        this._playerNodeList = [];
        this._cardNodeList = [];
        this._roomState = undefined;
        global.messageController.onSyncAllPlayerInfo = this.syncAllPlayerInfo.bind(this);
        global.messageController.onSyncRoomState = this.syncRoomState.bind(this);
        global.messageController.onChangeBanker = this.changeBanker.bind(this);
        global.messageController.onPushCard = this.pushCard.bind(this);
        this.upScoreNode = cc.instantiate(this.upScorePrefab);
        this.upScoreNode.parent = this.node;
        this.upScoreNode.active = false;
    },
    pushCard(data) {
        for (let i = 0 ; i < this._cardNodeList.length ; i ++){
            this._cardNodeList[i].destroy();
        }
        this._cardNodeList = [];
        console.log("push card data", data);
        for (let i = 0; i < data.length; i++) {
            let info = data[i];
            let card = cc.instantiate(this.cardPrefab);
            card.parent = this.node;
            card.emit('set-info', info);
            card.scale = 0.6;
            card.x = (5 - 1) * -0.5 * 50 + i * 50;
            card.y = -100;
            this._cardNodeList.push(card);
        }
        for (let i = 0 ; i < this._playerNodeList.length ; i ++){
            let player = this._playerNodeList[i];
            player.emit('push-card');
        }
        if (this._bankerId !== 0 && 
            this._bankerId !== global.playerData.getID()&&
            !this._currentPlayerScore
            ){
            this.upScoreNode.active = true;
        }
    },
    changeBanker(data) {
        let bankerId = data.bankerId;
        this._bankerId = bankerId;
        for (let i = 0; i < this._playerNodeList.length; i++) {
            let node = this._playerNodeList[i];
            node.emit("change-banker", bankerId);
        }
        if (bankerId !== global.playerData.getID()){
            this.upScoreNode.active = true;
        }else{
            this.upScoreNode.active = false;
        }
    },
    syncRoomState(data) {
        this._roomState = data;
        console.log("同步到了房间的状态是", this._roomState);
    },
    syncAllPlayerInfo(data) {
        let count = data.length - this._playerNodeList.length;
        this._bankerId = 0;
        for (let i = 0 ; i < data.length ; i ++){
            if (data[i].id === global.playerData.getID()){
                this._currentPlayerScore = data[i].currentScore;
            }
        }
        for (let i = 0 ; i < data.length ; i ++){
            if (data[i].isBanker){
                this._bankerId = data[i].id;
            }
        }
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
            playerNode.emit("update-info", data[i], i, selfIndex, this._playerNodeList.length);
        }

        if (data[0].id === global.playerData.getID() &&
            data.length > 1 &&
            this._roomState == 'wait') {
            this.startGameButton.active = true;
        } else {
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
            this._roomState = result.roomState;

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
                global.messageController.sendExitRoomMessage().then((result) => {
                    console.log("退出房间成功", result);
                    global.controller.enterMainNodeLayer();
                }).catch((err) => {
                    console.log("退出房间异常", err);
                });
                break;
            case "start-game":
                console.log("开始游戏");
                global.messageController.sendRequesrStartGameMessage().then(() => {
                    this.startGameButton.active = false;
                }).catch(() => {

                })
                break;
            default:
                break;
        }
    },
    update(dt) { }
});

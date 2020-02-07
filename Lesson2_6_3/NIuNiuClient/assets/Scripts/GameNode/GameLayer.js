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
        gamePlayerNodePrefab: cc.Prefab
    },
    onLoad () {},

    start () {
        global.messageController.sendRequestRoomInfoMessage().then((result)=>{
            console.log("请求房间信息成功", result);
            this.roomIdLabel.getComponent(cc.Label).string = "房间号：" + result.roomId;
            this.roundCountLabel.getComponent(cc.Label).string = "总局数:" + result.roundCount + " 当前局数:0" 
            this.kouCountLabel.getComponent(cc.Label).string = "扣牌的个数:" + result.kouCount;
            console.log("game config = ", this.GameConfig);
            let BankerNameConfig = this.GameConfig.json.BankerNameConfig;
            this.bankerTypeLabel.getComponent(cc.Label).string = "坐庄类型:" + BankerNameConfig[result.bankerType];
            let NiuNiuNameConfig = this.GameConfig.json.NiuNiuNameConfig;
            let rateStr = "倍数:";
            for (let i in NiuNiuNameConfig){
                let value = result.rateConfig[i];
                let name = NiuNiuNameConfig[i]
                rateStr += name + 'X' + value;
            }
            this.rateConfigLabel.getComponent(cc.Label).string = rateStr;
            let playersInfo = result.playersInfo; 
            for (let i = 0 ; i < playersInfo.length ; i ++){
                let info = playersInfo[i];
                this.addPlayerNode(info, i);
            }
        })
    },  
    addPlayerNode(info, index){
        let node = cc.instantiate(this.gamePlayerNodePrefab);
        node.parent = this.node;
        node.emit("init-player-node", info, index);
    },
    update (dt) {}
});

import global from "../global";

cc.Class({
    extends: cc.Component,

    properties: {
        roomIdLabel: cc.Node,
        roundCountLabel: cc.Node,
        kouCountLabel: cc.Node,
        bankerTypeLabel: cc.Node,
        rateConfigLabel: cc.Node,
        gameConfig: cc.JsonAsset
    },
    onLoad () {},

    start () {
        global.messageController.sendRequestRoomInfoMessage().then((result)=>{
            console.log("请求房间信息成功", result);
            this.roomIdLabel.getComponent(cc.Label).string = "房间号:" + result.roomId;
            this.roundCountLabel.getComponent(cc.Label).string = "总局数:" + result.roundCount + " 当前局数:0";
            this.kouCountLabel.getComponent(cc.Label).string = "扣牌的个数:" + result.kouCount;
            let BankerNameConfig = this.gameConfig.json.BankerNameConfig;
            this.bankerTypeLabel.getComponent(cc.Label).string = "坐庄类型:" + BankerNameConfig[result.bankerType];
            // this.bankerTypeLabel.getComponent(cc.Label).string = "坐庄类型:" + 
            // this.rateConfigLabel.getComponent(cc.Label).string = "倍数:" + "" 
            let NiuNiuConfig = this.gameConfig.json.NiuNiuNameConfig;
            console.log("niu niu config", NiuNiuConfig);
            let rateConfigStr = '倍数:';
            for (let i in NiuNiuConfig){
                let rateConfig = result.rateConfig;
                let value = rateConfig[i];
                rateConfigStr += NiuNiuConfig[i] + 'X' + value;
            }
            this.rateConfigLabel.getComponent(cc.Label).string = rateConfigStr;
        })
    },  

    update (dt) {}
});

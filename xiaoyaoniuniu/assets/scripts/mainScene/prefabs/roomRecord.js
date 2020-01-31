cc.Class({
    extends: cc.Component,

    properties: {
        connectNode: {
            default: null,
            type: cc.Node
        },
        roomRecordCell: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },
    initWithData: function (data) {
        console.log('room record init with data' + JSON.stringify(data));
        let gameData = JSON.parse(data.data);
        console.log('game data = ' + JSON.stringify(gameData));
        //根据数据长度，初始化 游戏记录
        for (let i = 0 ; i < gameData.length ; i ++){
            let  node = cc.instantiate(this.roomRecordCell);
            node.parent = this.connectNode;
            node.position = cc.p(0, -220 - i * 280);
            node.getComponent('roomRecordCell').initWithData(i, gameData[i]);
        }
        this.connectNode.height = 280 * gameData.length + 20;

    },
    onButtonClick: function (event, customData) {
        switch (customData){
            case 'close':
                this.node.destroy();
                break;
            default:
                break;
        }
    }
});

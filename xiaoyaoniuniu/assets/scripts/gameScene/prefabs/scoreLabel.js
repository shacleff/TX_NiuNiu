cc.Class({
    extends: cc.Component,

    properties: {
        nickNameLabel: {
            default: null,
            type: cc.Label
        },
        scoreLabel: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {

    },
    initWithData: function (data) {
        //根据数据初始化
        this.nickNameLabel.string = data.nickName;
        this.scoreLabel.string = data.currentScore + '';
        //游戏结果显示分数
    }
});

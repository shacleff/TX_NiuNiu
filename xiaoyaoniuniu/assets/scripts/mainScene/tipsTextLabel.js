cc.Class({
    extends: cc.Component,

    properties: {
        textLabel: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {
      this.runAction();
    },
    runAction: function () {
        cc.log("开始运动");
        this.textLabel.node.position = {
            x: 800,
            y: 0
        };
        let action = cc.moveTo(20, cc.p(-2000,0));
        let seq = cc.sequence(action,cc.callFunc(this.runAction.bind(this)));
        this.textLabel.node.runAction(seq);
    }


});

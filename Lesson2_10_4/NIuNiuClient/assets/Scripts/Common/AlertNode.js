cc.Class({
    extends: cc.Component,

    properties: {
        textLabel: cc.Node
    },
    onLoad () {
        this.node.on("show-text", (text)=>{
            this.textLabel.getComponent(cc.Label).string = text;
        });
        setTimeout(() => {
            this.node.destroy();
        }, 1500);
    },
    start () {

    },

    update (dt) {},
});

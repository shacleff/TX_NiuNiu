cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad() {

    },
    start() {

    },
    onButtonClick(event, customData) {
        console.log("custom data", customData);
        switch (customData) {
            case 'close':
                this.node.destroy();
                break;
            case 'create':
                this.node.destroy();
                break;    
            default:
                break;
        }
    },
    update(dt) { }
});

cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad() {
        this._roundCountType = 'round-count-10';
    
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

                let data = {
                    roundCountType: this._roundCountType
                }
                console.log("data", data);

                this.node.destroy();
                break;    
            default:
                break;
        }
        if (customData.indexOf("round-count") > -1){
            console.log("选择局数")
            this._roundCountType = customData;
        }
    },
    update(dt) { }
});

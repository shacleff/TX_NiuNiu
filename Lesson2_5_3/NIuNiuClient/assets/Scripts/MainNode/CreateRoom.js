import global from "./../global";

cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad() {
        this._roundCountType = 'round-count-10';
        this._bankerType = 'banker-type-1';
        this._kouType = 'kou-type-1';
        this._rateType = 'rate-type-0';
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
                    roundCountType: this._roundCountType,
                    bankerType : this._bankerType,
                    kouType: this._kouType,
                    rateType: this._rateType
                }
                console.log("create room with data", data);
                global.messageController.sendCreateRoomMessage(data).then((result)=>{
                    console.log("创建房间成功", result);
                    global.controller.enterGameLayer();
                    this.node.destroy();
                });

                
                break;
            default:
                break;
        }
        if (customData.indexOf("round-count") > -1){
            this._roundCountType = customData;
        }
        if (customData.indexOf("banker-type") > -1){
            this._bankerType = customData;
        }
        if (customData.indexOf("kou-type") > -1){
            this._kouType = customData;
        }
        if (customData.indexOf("rate-type") > -1){
            this._rateType = customData;
        }
    },
    update(dt) { }
});

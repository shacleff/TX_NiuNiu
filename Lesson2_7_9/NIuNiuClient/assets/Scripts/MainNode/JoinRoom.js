import global from "../global";

cc.Class({
    extends: cc.Component,

    properties: {
        numberLabelList: [cc.Node]
    },


    onLoad() {
        let children = this.node.children;
        for (let i = 0; i < children.length; i++) {
            let node = children[i];
            this.addButtonClickEvent(node);
        }
        this._inputStr = '';
        this.updateNumberShow();
    },
    addButtonClickEvent(node) {
        let button = node.addComponent(cc.Button);
        if (node.name !== 'mainBg6') {
            button.transition = cc.Button.Transition.SCALE;
        }
        node.on("click", () => {
            let value = node.name.substring(5);
            console.log("click value", value);
            if (node.name === 'btn_close'){
                console.log("关闭");
                this.node.destroy();
            }
            if (value == "0" || Number(value)) {
                console.log("数字")
                if (this._inputStr.length < 6) {
                    this._inputStr += value;
                    this.updateNumberShow();
                }
            } else {
                console.log("非数字")
                switch (value) {
                    case 'zuoxia':
                        this._inputStr = "";
                        this.updateNumberShow();
                        break;
                    case 'youxia':
                        this._inputStr = this._inputStr.substring(0,this._inputStr.length - 1);
                        this.updateNumberShow();
                        break;
                    default:
                        break;
                }
            }
        })
    },

    updateNumberShow() {
        for (let i = 0; i < this.numberLabelList.length; i++) {
            let label = this.numberLabelList[i];
            console.log("label ", label);
            label.getComponent(cc.Label).string = "";
        }
        for (let i = 0; i < this._inputStr.length; i++) {
            console.log("i = ", i);
            this.numberLabelList[i].getComponent(cc.Label).string = this._inputStr[i];
        }
        if (this._inputStr.length === 6){
            global.messageController.sendJoinRoomMessage(this._inputStr).then((result)=>{
                console.log("加入房间成功", result);
                global.controller.enterGameLayer();
            }).catch((err)=>{
                global.controller.showAlert(err);
                this._inputStr = "";
                this.updateNumberShow();
            });
        }
    },
    start() {

    },

    // update (dt) {},
});

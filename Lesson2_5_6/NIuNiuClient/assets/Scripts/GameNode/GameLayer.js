import global from "../global";

cc.Class({
    extends: cc.Component,

    properties: {
        roomIdLabel: cc.Node
    },
    onLoad () {},

    start () {
        global.messageController.sendRequestRoomInfoMessage().then((result)=>{
            console.log("请求房间信息成功", result);
            this.roomIdLabel.getComponent(cc.Label).string = "房间号：" + result.roomId;
        })
    },  

    update (dt) {}
});

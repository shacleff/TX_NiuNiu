
cc.Class({
    extends: cc.Component,

    properties: {
       headNode: cc.Node,
       nickNameNode: cc.Node,
       idLabelNode: cc.Node,
       houseCardLabel: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.loader.load("http://47.105.205.9:3000/images/roomcreate_huzi.png", (err, result)=>{
            if (err){
                console.log("load image err", err);
            }else{
                console.log("load success");
                this.headNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(result);
            }
        });
        this.node.on('login-success', (data)=>{
            let id = data.id;
            let nickName = data.nickname;
            this.nickNameNode.getComponent(cc.Label).string = nickName;
            this.idLabelNode.getComponent(cc.Label).string ="ID:" + id;
            this.houseCardLabel.getComponent(cc.Label).string = data.housecard_count;
        });
    },

    start () {

    },

    // update (dt) {},
});

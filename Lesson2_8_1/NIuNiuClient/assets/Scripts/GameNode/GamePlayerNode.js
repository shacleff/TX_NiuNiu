import global from "./../global";

cc.Class({
    extends: cc.Component,

    properties: {
        nickNameLabel: cc.Node,
        headNode: cc.Node,
        idLabel: cc.Node,
        gameConfig: cc.JsonAsset
    },



    onLoad() {
        this.playerNodePositionConfig = this.gameConfig.json.PlayerNodePositionConfig;
        this.node.on("init-player-node", (info, index) => {
            let id = info.id;
            this._id = id;
            let nickName = info.nickname;
            this.nickNameLabel.getComponent(cc.Label).string = nickName;
            this.idLabel.getComponent(cc.Label).string = "ID:" + id;
            this.updateHeadImage(info.headImageUrl);
        });
        this.node.on('update-position', (index, selfIndex, count) => {
            console.log("index = ", index);
            console.log("self index", selfIndex);
            let config = this.playerNodePositionConfig[count];
            let currentIndex = selfIndex - index;
            if (currentIndex < 0) {
                currentIndex = count + currentIndex;
            }
            this.node.x = config[currentIndex].x;
            this.node.y = config[currentIndex].y;
        });
    },

    updateHeadImage(url) {
        console.log("更新玩家头像", url);
        cc.loader.load(url, (err, result) => {
            if (!err) {
                console.log("图片加载成功");
                this.headNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(result);
            } else {
                console.log("game player node load head image fail ", err);
            }
        });
    },
    start() {

    },

    // update (dt) {},
});

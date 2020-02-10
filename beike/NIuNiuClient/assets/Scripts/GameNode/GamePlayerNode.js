import global from "./../global";

cc.Class({
    extends: cc.Component,

    properties: {
        nickNameLabel: cc.Node,
        headNode: cc.Node,
        idLabel: cc.Node,
        gameConfig: cc.JsonAsset,
        houseMasterMark: cc.Node,
        bankerIcon: cc.Node,
        cardPrefab: cc.Prefab,
        currentScoreNode: cc.Node,
        totalScoreLabel: cc.Node,
        scoreTextureList: [cc.SpriteFrame]
    },



    onLoad() {
        this._cardNodeList = [];
        this.playerNodePositionConfig = this.gameConfig.json.PlayerNodePositionConfig;
        this.cardPositionConfig = this.gameConfig.json.CardPositionConfig;
        // this.node.on("init-player-node", (info, index) => {
        //     let id = info.id;
        //     this._id = id;
        //     let nickName = info.nickname;
        //     this.nickNameLabel.getComponent(cc.Label).string = nickName;
        //     this.idLabel.getComponent(cc.Label).string = "ID:" + id;
        //     this.updateHeadImage(info.headImageUrl);
        // });
        this.node.on('update-info', (info, index, selfIndex, count) => {
            let id = info.id;
            this._id = id;
            this._playerCount = count;
            let nickName = info.nickname;
            this.nickNameLabel.getComponent(cc.Label).string = nickName;
            this.idLabel.getComponent(cc.Label).string = "ID:" + id;
            this.updateHeadImage(info.headImageUrl);
            let isHouseMaster = info.isHouseMaster;
            this.houseMasterMark.active = isHouseMaster;
            console.log("index = ", index);
            console.log("self index", selfIndex);
            let config = this.playerNodePositionConfig[count];
            let currentIndex = selfIndex - index;
            if (currentIndex < 0) {
                currentIndex = count + currentIndex;
            }
            this._currentIndex = currentIndex;
            this.node.x = config[currentIndex].x;
            this.node.y = config[currentIndex].y;
            let isBanker = info.isBanker;
            this.bankerIcon.active = isBanker;
            let currentScore = info.currentScore;
            let totalScore = info.totalScore;
            console.log("current score", currentScore);
            console.log("total score", totalScore);
            if (currentScore > 0){
                this.currentScoreNode.getComponent(cc.Sprite).spriteFrame = this.scoreTextureList[currentScore - 1];
            }else{
                this.currentScoreNode.getComponent(cc.Sprite).spriteFrame = undefined;
            }
            this.totalScoreLabel.getComponent(cc.Label).string = totalScore;

        });
        this.node.on('change-banker', (id) => {
            this.bankerIcon.active = false;
            if (this._id === id) {
                // this.ban
                this.bankerIcon.active = true;
            }
        });
        this.node.on("push-card", () => {
            for (let i = 0 ; i < this._cardNodeList.length ; i ++){
                this._cardNodeList[i].destroy();
            }
            this._cardNodeList = [];
            if (this._id !== global.playerData.getID()) {
                let positionConfig = this.cardPositionConfig[this._playerCount];
                for (let i = 0; i < 5; i++) {
                    let card = cc.instantiate(this.cardPrefab);
                    card.parent = this.node;
                    card.emit("set-info", { number: 0, color: "" });
                    let position = positionConfig[this._currentIndex];
                    card.scale = 0.4;
                    card.y = position.y;
                    card.x = position.x + (5 - 1) * 0.5 * - 40 + 40 * i;
                    this._cardNodeList.push(card);
                }
            }
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

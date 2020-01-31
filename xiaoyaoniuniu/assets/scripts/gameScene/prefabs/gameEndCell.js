cc.Class({
    extends: cc.Component,

    properties: {
        bgSpriteFrameList: {
            default: [],
            type: cc.SpriteFrame
        },
        bgNode: {
            default: null,
            type: cc.Node
        },
        fontList: {
            default: [],
            type: cc.Font
        },
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        nickNameLabel: {
            default: null,
            type: cc.Label
        },
        idLabel: {
            default: null,
            type: cc.Label
        },
        headImage: {
            default: null,
            type: cc.Node
        }
    },
    initWithData: function (index,houseManager,data) {
        //初始化数据
        console.log('init with data = ' + JSON.stringify(data));
        if (index === 0){
            this.bgNode.getComponent(cc.Sprite).spriteFrame = this.bgSpriteFrameList[0];

        }else {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = this.bgSpriteFrameList[1];
        }
        if (data.score > 0){
            this.scoreLabel.font = this.fontList[0];
        }else {
            this.scoreLabel.font = this.fontList[1];
        }
        this.nickNameLabel.string = data.nickName;
        this.idLabel.string = 'ID' + data.uid;
        this.scoreLabel.string = data.score + '';
        cc.loader.load({url: data.avatar, type: 'png'},  (err, texture)=> {
            // Use texture to create sprite frame
            if (err){
                console.log('err = ' + err);
            }else {
                let oldWidth = this.headImage.width;
                console.log('old width = ' + oldWidth);
                this.headImage.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                console.log('now width = ' + this.headImage.width);
                // this.headImage.scale = 0.16;
            }
        });


    }
});

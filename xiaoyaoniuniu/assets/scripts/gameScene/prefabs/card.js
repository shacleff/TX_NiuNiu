const Number = {
    'A': 14,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    '11': 11,
    '12': 12,
    '13': 13
};
const Color = {
    'S': 'Spade',
    'H': 'Heart',
    'C': 'Club',
    'D': 'Diamond'
};
const CardState = {
    Invalide: -1,
    BackGround: 1,
    FowardGround: 2
};
cc.Class({
    extends: cc.Component,

    properties: {
        spriteAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        bgNode: {
            default: null,
            type: cc.Node
        },
        fgNode: {
            default: null,
            type: cc.Node
        },
        valueNode1: {
            default: null,
            type: cc.Node
        },
        iconNode: {
            default: null,
            type: cc.Node
        },
        smallIconNode: {
            default: null,
            type: cc.Node
        },
        fanpaiSound: {
            url: cc.AudioClip,
            default: null
        }
    },


    onLoad () {
        this.fgNode.active = false;
        this.state = CardState.Invalide;
        this.setState(CardState.BackGround);
    },
    setState: function (state) {
        if (this.state === state){
            return
        }
        switch (state){
            case CardState.BackGround:
                break;
            case CardState.FowardGround:
                break;
            default:
                break;
        }
        this.state = state;
    },
    initWithData: function (data) {
        //
        console.log('初始化一张牌' + JSON.stringify(data));
        //b-red_0

        this.cardData = data;


    },
    getNumberSpriteFrameStr: function (data) {
        let numberValue = data.number;
        let flowerColor = data.color;
        let color = '';
        let number = '';
        if (flowerColor ==='H' || flowerColor === 'D'){
            color = 'red';
        }else {
            color = 'black';
        }
        // numberValue =

        if (numberValue === 'A'){
            number = '0';
        }else {
            number = (parseInt(numberValue) - 1 ) + '';
        }
        //b-red_11;
        console.log('color' + color);
        console.log('number = ' + number);
        //然后取出牌的纹理
        return color + '_' + number;
    },
    getColorSpriteFrameStr: function (data) {
        let flowerColor = data.color;
        let str = '';
        switch (flowerColor){
            case "S":
                str = '3';
                break;
            case "H":
                str = '2';
                break;
            case "C":
                str = '1';
                break;
            case "D":
                str = '0';
                break;
            default:
                break;
        }
       return str;
    },
    nowShowCardsValue: function (cardData) {
        console.log('show card values = ' + JSON.stringify(cardData));
        this.fgNode.active = true;
        let numberIcon = 'b-' + this.getNumberSpriteFrameStr(cardData);
        let iconStr = 'b-bigtag_' + this.getColorSpriteFrameStr(cardData);
        this.valueNode1.addComponent(cc.Sprite).spriteFrame = this.spriteAtlas.getSpriteFrame(numberIcon);
        this.iconNode.addComponent(cc.Sprite).spriteFrame = this.spriteAtlas.getSpriteFrame(iconStr);
        this.smallIconNode.addComponent(cc.Sprite).spriteFrame = this.spriteAtlas.getSpriteFrame(iconStr);
    },
    showCardsValue: function (cardData) {
        console.log('展示牌的值');
        if (this.state === CardState.BackGround){

        }else {
            //如果现在是背景状态 的 会返回
            return;
        }
        //显示牌的值
        let endScale = 0.9;
        if (cardData){
            endScale = 0.6;
            this.cardData = cardData;
        }
        this.fgNode.active = true;
        //激活前景
        //然后显示牌面
        let action1 = cc.scaleTo(0.2, 0.2, this.node.scaleY);
        let seq = cc.sequence(action1, cc.callFunc(function () {
            let numberIcon = 'b-' + this.getNumberSpriteFrameStr(this.cardData);
            let iconStr = 'b-bigtag_' + this.getColorSpriteFrameStr(this.cardData);
            this.valueNode1.addComponent(cc.Sprite).spriteFrame = this.spriteAtlas.getSpriteFrame(numberIcon);
            this.iconNode.addComponent(cc.Sprite).spriteFrame = this.spriteAtlas.getSpriteFrame(iconStr);
            this.smallIconNode.addComponent(cc.Sprite).spriteFrame = this.spriteAtlas.getSpriteFrame(iconStr);
        }.bind(this)), cc.scaleTo(0.2, endScale, this.node.scaleY));
        this.node.runAction(seq);
        this.setState(CardState.FowardGround);
        cc.audioEngine.play(this.fanpaiSound, false, 1);
    },
    getData: function () {
        return this.cardData;
    }

});

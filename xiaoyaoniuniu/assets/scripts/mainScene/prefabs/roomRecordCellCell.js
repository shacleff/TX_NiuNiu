
cc.Class({
    extends: cc.Component,

    properties: {
        nickNameLabel:{
            default: null,
            type: cc.Label
        },
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        cardList: {
            default: [],
            type: cc.Node
        }
    },
    onLoad () {
        
    },
    initWithData: function (data) {
        console.log('room record cell cell init with data = ' + JSON.stringify(data));
        this.nickNameLabel.string = data.nickName;
        this.scoreLabel.string = data.currentScore + '';
        let cardListData = data.cardList;
        for (let i = 0 ; i < cardListData.length ; i ++){
            let card = this.cardList[i];
            card.getComponent('card').nowShowCardsValue(cardListData[i]);
        }
    }


});

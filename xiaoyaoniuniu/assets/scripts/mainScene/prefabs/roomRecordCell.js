cc.Class({
    extends: cc.Component,

    properties: {
        numLabel: {
            default: null,
            type: cc.Label
        },
        timeLabel: {
            default: null,
            type: cc.Label
        },
        cardLists: {
            default: [],
            type: cc.Node
        }
    },

    onLoad(){

    },
    initWithData: function (index, data) {
        console.log('index = ' + index);
        this.numLabel.string = 'No.' + index;
        this.timeLabel.string = data.time;
        let cards = data.cards;
        for (let i = 0 ; i < cards.length ; i ++){
            let node = this.cardLists[i];
            node.active = true;
            node.getComponent('roomRecordCellCell').initWithData(cards[i]);
        }
        console.log('room record cell init with data = ' + JSON.stringify(data));
    }
});

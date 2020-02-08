const Config = require("./GameConfig");
const PokerConfig = Config.PokerConfig;
const Card = require("./Card")
class CardController {
    constructor() {

    }
    static getOnePackCard() {
        //获取一副牌并且洗好拍
        let NumberConfig = PokerConfig.Number;
        let ColorConfig = PokerConfig.Color;
        let cardList = [];
        for (let i = 0; i < NumberConfig.length; i++) {
            for (let j = 0; j < ColorConfig.length; j++) {
                let card = new Card(NumberConfig[i], ColorConfig[j]);
                cardList.push(card);
            }
        }
        console.log("new pack card = ", JSON.stringify(cardList));
        cardList = cardList.sort(()=>{
            return Math.random() * 2 - 1;
        })
        return cardList;
        console.log("new pack card = ", JSON.stringify(cardList));
    }
}
module.exports = CardController;
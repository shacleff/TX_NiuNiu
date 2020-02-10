const GameConfig = require("./GameConfig");
let PokerConfig = GameConfig.PokerConfig;
let Card = require('./Card')
class CardController {
    constructor() {

    }
    static getNewPackCard() {
        //返回一副新的牌，并且是洗好的牌
        let cardList = [];
        for (let i = 0; i < PokerConfig.Number.length; i++) {
            for (let j = 0; j < PokerConfig.Color.length; j++) {
                let number = PokerConfig.Number[i];
                let color = PokerConfig.Color[j];
                // let card = new CardController();
                let card = new Card(number, color);
                cardList.push(card);
            }
        }
        console.log("card list = ", JSON.stringify(cardList));
        cardList = cardList.sort(()=>{
            return Math.random() * 2 - 1;
        });
        console.log("card list = ", JSON.stringify(cardList));
        return cardList;

    }
}
module.exports = CardController;
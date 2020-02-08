
class Card{
    constructor(number, color){
        this._number = number;
        this._color = color;
        this._isShow = true;
        // 黑桃（Spade）、红桃（Heart）、方块（Diamond）、梅花（Club
    }
    setState(value){
        this._isShow = value;
    }
    getNumber(){
        return this._number;
    }
    getColor(){
        return this._color;
    }
}
module.exports = Card;
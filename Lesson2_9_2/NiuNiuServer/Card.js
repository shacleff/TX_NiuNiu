class Card {
    constructor(number, color) {
        this._number = number;
        this._color = color;
        this._isShow = true;
    }
    setShow(value) {
        this._isShow = value;
    }
    getShow() {
        return this._isShow;
    }
    getInfo() {
        return {
            number: this._isShow ? this._number : 0,
            color: this._isShow ? this._color : ""
        }
    }
}
module.exports = Card;
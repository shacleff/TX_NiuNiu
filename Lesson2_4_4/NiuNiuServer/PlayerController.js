const Player = require('./Player');
class PlayerController {
    constructor(db) {
        this._playerList = [];
        this._db = db;
    }
    playerLogin(id) {
        return new Promise((resole) => {
            for (let i = 0; i < this._playerList.length; i++) {
                let player = this._playerList[i];
                if (player.getId() === id) {
                    player.reConnect();
                    resole(player.getPlayerInfo());
                    return;
                }
            }
            this._db.getUserInfo(id).then((result) => {
                // this.sendMessage("login", client, callBackId, result[0]);
                let player = new Player(id,result[0]);
                this._playerList.push(player);
                resole(result[0]);
            });
        })
    }
}
module.exports = PlayerController;
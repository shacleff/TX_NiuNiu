import Tool from "./Tool";

class PlayerData{
    constructor(){
        this._id = Tool.getQueryVariable('id') || "000000";
        console.log('player id = ', this._id);
    }
    getID(){
        return this._id;
    }
}
export default PlayerData;
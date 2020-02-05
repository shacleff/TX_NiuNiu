class Room {
    constructor(id, data){
        console.log("创建了新房间 id= ", id);
        console.log("参数=", JSON.stringify(data));
        this._id = id;
    }
    getId(){
        return this._id;
    }
}
module.exports = Room;
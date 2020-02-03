const Room = require('./Room');
class RoomController {
    constructor() {
        this._roomList = [];
    }
    createRoom(data) {
        console.log("create room data", JSON.stringify(data));
        return this.getNewRoomId().then((id)=>{
            console.log("得到了一个新的房间id", id);
            let room = new Room(id, data);
            this._roomList.push(room);
            
        })
    }
    getNewRoomId() {
        const getNewId = (cb) => {
            let str = '';
            for (let i = 0; i < 6; i++) {
                str += Math.round(Math.random() * 10);
            }
            for (let i = 0; i < this._roomList.length; i++) {
                let room = this._roomList[i];
                let id = room.getId();
                if (id === str) {
                    //存在重复的 id
                    getNewId(cb);
                    return
                }
            }
            //不存在重复的id，那么调用回调
            if (cb) {
                cb(str);
            }

        }
        return new Promise((resole) => {
            getNewId(resole);
        })
    }
}
module.exports = RoomController;
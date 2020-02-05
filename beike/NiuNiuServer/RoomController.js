const Room = require("./Room")
class RoomController {
    constructor() {
        this._roomList = [];
    }
    createRoom(data) {
        console.log("room controller create room", JSON.stringify(data));
        // return new Promise(()=>{

        //     new room = new Room(id,data);
        // })
        return this.getNewRoomId().then((id) => {
            console.log("new room id = ", id);
            let room = new Room(id, data);
            this._roomList.push(room);
            // return new Promise((resolse)=>{
            //     resolse(id);
            // })
            return Promise.resolve(id);
        })
    }
    getNewRoomId() {
        const getStr = (cb) => {
            let str = '';
            //112233 ,123456
            for (let i = 0; i < 6; i++) {
                str += Math.round(Math.random() * 9);
            }
            for (let i = 0; i < this._roomList.length; i++) {
                let room = this._roomList[i];
                if (room.getId() === str) {
                    //已经存在此id
                    getStr(cb);
                    return;
                }
            }
            if (cb) {
                cb(str);
            }
        }
        return new Promise((resolse) => {
            getStr(resolse);
        });
    }
    requestJoinRoom(roomId, player){
        //
        return new Promise((resole, reject)=>{
            let target = undefined;
            for (let i = 0 ; i < this._roomList.length ; i ++){
                let room = this._roomList[i];
                if (room.getId() === roomId){
                    //存在此房间
                    target = room;
                    break;
                }
            }
            if (target){
                let isCanJoin = target.isCanJoin();
                if (isCanJoin === true){
                    target.joinRoom(player);
                    resole('success');
                }else{
                    reject(isCanJoin);
                }
                console.log("is can join", isCanJoin);
            }else{
                reject('未找到此房间' + roomId);
            }
        });
       
    }
}
module.exports = RoomController;
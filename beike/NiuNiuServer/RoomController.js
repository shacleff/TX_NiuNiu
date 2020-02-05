const Room = require("./Room")
class RoomController {
    constructor(){
        this._roomList = [];
    }
    createRoom(data){
        console.log("room controller create room", JSON.stringify(data));
        return this.getNewRoomId().then((id)=>{
            console.log("new room id = ", id);
            let room = new Room(id, data);
            this._roomList.push(room);
            return new Promise((resolse)=>{
                resolse(id);
            })
        })
    }
    getNewRoomId(){
        const getStr = (cb)=>{
            let str = '';
            //112233 ,123456
            for (let i = 0 ; i < 6 ; i ++){
                str += Math.round(Math.random() * 9);
            }
            for (let i = 0 ; i < this._roomList.length ; i ++){
                let room = this._roomList[i];
                if (room.getId() === str){
                    //已经存在此id
                    getStr(cb);
                    return;
                }
            }
            if (cb){
                cb(str);
            }
        }
        return new Promise((resolse)=>{
            getStr(resolse);
        });
    }
    requestJoinRoom(roomId){
        console.log("请求进入房间", roomId);
        return new Promise(()=>{
            
        })
    }   
}
module.exports = RoomController;
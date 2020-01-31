import global from './../../global'
cc.Class({
    extends: cc.Component,

    properties: {

        buttonAudioClicp: {
            url: cc.AudioClip,
            default: null
        },
        playerGameRecord: {
            default: null,
            type: cc.Prefab
        },
        connectNode: {
            default: null,
            type: cc.Node
        },
        roomRecord: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {
        // global.sock
        global.socketControl.requestPlayerRecord();
        global.event.on('reback_player_game_record',  (data)=>{
            //根据游戏数据的长度来显示游戏结果
            console.log('请求玩家游戏记录的返回' + JSON.stringify(data));
            for (let i = 0 ; i < data.length ; i ++){
                let node = cc.instantiate(this.playerGameRecord);
                node.parent = this.connectNode;
                node.position = cc.p(0, -90 - i * 160);
                node.getComponent('playerRecordCell').initWithData(this,data[i]);
            }
            this.connectNode.height = 160 * data.length + 10;
        });
        global.event.on('reback_room_game_record', (data)=>{
            console.log('收到了房间的详细信息' + JSON.stringify(data));
            this.isRequesting = false;
            let node = cc.instantiate(this.roomRecord);
            node.parent = this.node;
            node.getComponent('roomRecord').initWithData(data);
            //展示房间的一些信息
        });
        // let height = 100;
        // for (let i = 0 ; i < 10 ; i ++){
        //     let node = cc.instantiate(this.playerGameRecord);
        //     node.parent = this.connectNode;
        //     console.log('node height = ' + node.height);
        //     node.position = cc.p(0,-90 - i * 160);
        //     height = node.height;
        // }
        // this.connectNode.height = 160 * 10 + 10;
        this.isRequesting = false;
    },
    onButtonClick: function (event, customData) {
        if (!global.account.playerData.soundOff){
            cc.audioEngine.play(this.buttonAudioClicp, false, 1);
        }
        switch (customData){
            case 'back':
                this.node.destroy();
                break;
            default:
                break;
        }
    },
    onDestroy: function () {
        global.event.removeType('reback_player_game_record');
        global.event.removeType('reback_room_game_record');
    },
    getRoomRecord: function (roomID) {
        console.log('roomId = ' + roomID);
        if (this.isRequesting){
            return;
        }
        this.isRequesting = true;
        this.requestRoomId = roomID;
        global.socketControl.requestRoomRecord(roomID);
    }

});

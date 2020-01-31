import global from './../../global'
cc.Class({
    extends: cc.Component,

    properties: {
        numLabels: {
            default: [],
            type: cc.Label
        },
        loadPrefab: {
            default: null,
            type: cc.Prefab
        },
        tipsLabel: {
            default: null,
            type: cc.Label
        },
        buttonAudioClicp: {
            url: cc.AudioClip,
            default: null
        }
    },

    // use this for initialization
    onLoad: function () {
        this.str = '';
        global.event.on('join_room_fail', this.joinRoomFail.bind(this));
        this.tipsLabel.label = '';
    },

    joinRoomFail: function (data) {
        console.log('join room 加入房间失败' + JSON.stringify(data));
        this.tipsLabel.string = data.msg;
        setTimeout(()=>{
            this.tipsLabel.string = '';
            this.str = '';
            this.referUI();
        },1000);



        if (this.loadNode){
            this.loadNode.destroy();
        }
    },

    onButtonClick: function (event, customData) {
        // console.log('global account player data = ' + global.account.playerData.soundOff);
        if (!global.account.playerData.soundOff){
            cc.audioEngine.play(this.buttonAudioClicp, false, 1);
        }
        if (parseInt(customData) >=0 && parseInt(customData) <= 9){
            this.str += customData;
        }

        switch (customData){
            case 'clear':
                this.str = '';
                break;
            case 'back':
                this.str = this.str.substring(0, this.str.length - 1);
                break;
            case 'close':
                this.node.destroy();
            default:
                break;
        }
        if (this.str.length > 6){
            this.str = this.str.substring(0,6);
        }
        this.referUI();
        if (this.str.length === 6){
            //进入游戏
            this.loadNode = cc.instantiate(this.loadPrefab);
            this.loadNode.parent = this.node;
            global.socketControl.joinRoom(this.str);
            //显示loading
            console.log('进入游戏' + this.str);

        }
    },
    referUI: function () {
        for (let i = 0 ; i < this.numLabels.length ; i ++){
            this.numLabels[i].string = '';
        }
        for (let i = 0 ; i < this.str.length ; i ++){
            this.numLabels[i].string = this.str[i];
        }
    },
    onDestroy: function () {
        global.event.removeType('join_room_fail');
    }
});

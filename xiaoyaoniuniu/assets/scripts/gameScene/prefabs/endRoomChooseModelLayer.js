import global from './../../global'
cc.Class({
    extends: cc.Component,

    properties: {
        tipLabel: {
            default: null,
            type: cc.Label
        },
        buttonAudioClicp: {
            url: cc.AudioClip,
            default: null
        }
    },
    onLoad: function () {
        this.tipLabel.string = '是否同意' + global.account.playerData.endRoomPlayerNickName + '立即解散房间!';
    },

    start () {

    },

    onButtonClick: function (event, coustomData) {
        if (!global.account.playerData.soundOff){
            cc.audioEngine.play(this.buttonAudioClicp, false, 1);
        }
        switch (coustomData){
            case 'ok':
                console.log('确定');
                global.socketControl.chooseEndRoom('ok');
                this.node.destroy();
                break;
            case 'cancel':
                console.log('取消');
                global.socketControl.chooseEndRoom('cancel');
                this.node.destroy();
                break;
            default:
                break
        }
    }
});

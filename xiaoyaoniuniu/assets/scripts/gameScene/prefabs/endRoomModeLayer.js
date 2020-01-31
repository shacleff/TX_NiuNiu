import global from './../../global'
cc.Class({
    extends: cc.Component,

    properties: {
        okButton: {
            default: null,
            type: cc.Node
        },
        cancelButton: {
            default: null,
            type: cc.Node
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

    onLoad: function () {
    },

    start () {

    },
    onButtonClick: function (event, coustomData) {
        if (!global.account.playerData.soundOff){
            cc.audioEngine.play(this.buttonAudioClicp, false, 1);
        }

        switch (coustomData){
            case 'ok':
                console.log('ok 按钮');

                global.socketControl.endRoom();
                this.enterWaitJieSan();
                break;
            case 'cancel':
                console.log('cancel 按钮');
                this.node.destroy();
                global.socketControl.cancelEndRoom();
                break;
            default:
                break
        }
    },
    enterWaitJieSan: function () {
        let action1 = cc.fadeOut(0.4);
        this.okButton.runAction(action1);
        let action2 = cc.moveTo(0.4,cc.p(0,-115));
        this.cancelButton.runAction(action2);
        this.tipsLabel.string = "取消解散!";
    }

});

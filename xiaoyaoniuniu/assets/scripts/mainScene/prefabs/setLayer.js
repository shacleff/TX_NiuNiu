import global from './../../global'
cc.Class({
    extends: cc.Component,

    properties: {
        toggleButton: {
            default: null,
            type: cc.Toggle
        },
        buttonAudioClicp: {
            url: cc.AudioClip,
            default: null
        }
    },


    onLoad () {
        global.account.playerData.soundOff = false;
    },
    onButtonClick: function (event, customData) {

        switch (customData){
            case 'ok':
                let state = this.toggleButton.isChecked;
                global.account.playerData.soundOff = !state;

                if (!global.account.playerData.soundOff){
                    cc.audioEngine.play(this.buttonAudioClicp, false, 1);
                }
                this.node.destroy();
                break;
            case 'cancel':
                if (!global.account.playerData.soundOff){
                    cc.audioEngine.play(this.buttonAudioClicp, false, 1);
                }
                this.node.destroy();
                break;
        }
    }


});

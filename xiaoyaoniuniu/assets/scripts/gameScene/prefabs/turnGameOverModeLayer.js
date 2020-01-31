import global from './../../global'
cc.Class({
    extends: cc.Component,

    properties: {
        winBg: {
            default: null,
            type: cc.Node
        },
        loseBg: {
            default: null,
            type: cc.Node
        },
        scoreLabel: {
            default: null,
            type: cc.Prefab
        },
        parentNode: {
            default: null,
            type: cc.Node
        },
        startButton: {
            default: null,
            type: cc.Node
        },
        resultButton: {
            default: null,
            type: cc.Node
        },
        buttonAudioClicp: {
            url: cc.AudioClip,
            default: null
        },
        winAudioClicp: {
            url: cc.AudioClip,
            default: null
        },
        loseAudioClicp: {
            url: cc.AudioClip,
            default: null
        }
    },

    // use this for initialization
    onLoad: function () {
        //首先根据得分情况，显示胜利失败结果
        //根据游戏结果数据初始化内容
        console.log('global game turn result' + JSON.stringify(global.turnGameResult));
        //首先判断一下自己是失败还是胜利
        let selfWin = false;
        for (let i = 0 ; i < global.turnGameResult.length ; i++){
            let gameResult = global.turnGameResult[i];
            if (gameResult.uid === global.account.playerData.uid) {
                if (gameResult.currentScore > 0){
                    selfWin = true;
                }
            }
        }
        if (selfWin){
            cc.audioEngine.play(this.winAudioClicp,false, 1);
        }else {
            cc.audioEngine.play(this.loseAudioClicp,false, 1);

        }

        this.winBg.active = selfWin;
        this.loseBg.active =!selfWin;
        //然后显示分数
        global.turnGameResult.sort(function (a,b) {
           //按照 分数高低进行排序
            if (a.currentScore < b.currentScore){
                return true;
            }
            return false;
        });
        //然后初始化分数lable
        for (let i = 0 ; i < global.turnGameResult.length ; i ++){
            let label =  cc.instantiate(this.scoreLabel);
            label.getComponent('scoreLabel').initWithData(global.turnGameResult[i]);
            label.parent = this.parentNode;
            label.position = cc.p(0, 74 + i * -70);
        }
        this.timeCutDown = 12;
        if (global.account.playerData.lastRoundCount === 0){
            this.startButton.active = false;
            this.resultButton.active = true;
        }else {
            this.startButton.active = true;
            this.resultButton.active = false;
        }

    },
    update: function (dt) {
        if (this.timeCutDown > 0){
            this.timeCutDown -= dt;
            if (this.timeCutDown <= 0){
                this.timeCutDown = 0;
                global.socketControl.restartGame();//重新开始游戏
                this.node.destroy();
            }
        }
    },
    onButtonClick: function (event, customData) {
        console.log('on button click');
        if (!global.account.playerData.soundOff){
            cc.audioEngine.play(this.buttonAudioClicp, false, 1);
        }
        if (customData === 'start_game'){
            console.log('开始游戏');
            // global.event.fire('restart_game');
            global.socketControl.restartGame();//重新开始游戏
            this.node.destroy();
            this.timeCutDown = 0;
        }
    }
});

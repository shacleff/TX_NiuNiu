import global from './../../global'
cc.Class({
    extends: cc.Component,

    properties: {
        gameCountChoose: {
            default: null,
            type: cc.ToggleGroup
        },
        bankerChoose: {
            default: null,
            type: cc.ToggleGroup
        },
        lockCardChoose: {
            default: null,
            type: cc.ToggleGroup
        },
        rateChoose: {
            default: null,
            type: cc.ToggleGroup
        },
        specialChoose: {
            default: null,
            type: cc.ToggleGroup
        },
        buttonAudioClicp: {
            url: cc.AudioClip,
            default: null
        },
        tipsLabel: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {
        //加载游戏配置
        cc.loader.loadRes("config/game-config.json", (err, result) => {
            if (err) {
                console.log('err = ' + err);
            } else {
                console.log('result = ' + JSON.stringify(result));
            }
            this.gameConfig = result.json;
        });
    },

    onButtonClick: function (event, customData) {
        switch (customData) {
            case 'close':
                this.node.destroy();
                break;
            case 'createroom':
                //创建房间

                this.createRoom();
                break;
            default:
                break;
        }
        if (!global.account.playerData.soundOff){
            cc.audioEngine.play(this.buttonAudioClicp, false, 1);
        }

    },
    createRoom: function () {
        //创建房间
        let houseCardCast = 0;
        let gameTurnCount = 0;
        for (let i in this.gameCountChoose.toggleItems) {
            let toogle = this.gameCountChoose.toggleItems[i];
            console.log('toggle is checked = ' + toogle.isChecked);
            if (toogle.isChecked) {
                let name = toogle.node.name;
                let config = this.gameConfig['game_turn_count'];
                houseCardCast = config[name].houseCast;
                gameTurnCount = config[name].count;
            }
        }
        if (houseCardCast > global.account.playerData.houseCardCount){
            //房卡数目不够 请前往充值

            this.tipsLabel.string = '房卡数目不够，请前往充值';

            if (!this.tipsAction){
                this.tipsAction = cc.sequence(cc.delayTime(2), cc.fadeOut(1), cc.callFunc(()=>{
                    this.tipsAction = undefined;
                    this.tipsLabel.string = '';
                    this.tipsLabel.node.opacity = 255;
                }));
                this.tipsLabel.node.runAction(this.tipsAction);
            }
            return
        }
        //
        cc.log('需要的房卡数是' + houseCardCast);
        cc.log('游戏的总局数' + gameTurnCount);
        // let bankerConfig = this.gameConfig['banker_rule'];
        let bankerRule = '';
        for (let i in this.bankerChoose.toggleItems) {
            let toggle = this.bankerChoose.toggleItems[i];
            if (toggle.isChecked === true) {
                // bankerRule = bankerConfig[toggle.node.name];
                bankerRule = toggle.node.name;
            }
        }
        console.log('连庄规则' + bankerRule);
        //扣牌规则
        let lockRule = "";
        // let lockConfig = this.gameConfig['lock_card'];
        for (let i in this.lockCardChoose.toggleItems) {
            let toggle = this.lockCardChoose.toggleItems[i];
            if (toggle.isChecked) {
                // lockRule = lockConfig[toggle.node.name];
                lockRule = toggle.node.name;
            }

        }
        let rateCount = "";
        // let rateConfig = this.gameConfig['rate_count'];
        for (let i in this.rateChoose.toggleItems) {
            let toggle = this.rateChoose.toggleItems[i];
            if (toggle.isChecked) {
                // rateCount = rateConfig[toggle.node.name];
                rateCount = toggle.node.name;
            }
        }
        cc.log('rate count = ' + rateCount);

        let specialChoose = "";
        // let specialConfig = this.gameConfig["special_card"];
        for (let i in this.specialChoose.toggleItems) {
            let toggle = this.specialChoose.toggleItems[i];
            if (toggle.isChecked) {
                // specialChoose = specialConfig[toggle.node.name];
                specialChoose = toggle.node.name;
            }
        }
        cc.log('special card = ' + specialChoose);
        global.socketControl.createRoom({
            houseCardCount: houseCardCast,
            roundCount: gameTurnCount,
            lockRule: lockRule,
            rateRule: rateCount,
            specialType: specialChoose,
            bankerRule: bankerRule
        });
        this.node.destroy();
    }
});

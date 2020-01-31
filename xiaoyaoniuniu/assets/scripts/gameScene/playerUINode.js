import global from './../global'
const PlayerStateLabelStr = {
    'waitready': '等待其他人准备:',
    'waitplayerchooserate': '等待其他人下注:',
    'chooserate': '请选择下注分数:',
    'qingliangpai': '请亮牌:',
    'waitplayerliangpai':'还有人在苦思冥想:',
    'newgame': '新的牌局即将开始:'

};
const PlayerUiNodeState = {
    Invalide: -1,
    Default: 5,
    ChooseRate:1,
    WaitChooseRate: 2,
    ChooseCow:3,
    ShowCow:4,
    ShowScore:5,
    pushCard:6,
    Reset: 7
};
cc.Class({
    extends: cc.Component,

    properties: {
        cardPrefab: {
            default: null,
            type: cc.Prefab
        },
        cardsNode: {
            default: null,
            type: cc.Node
        },
        rateButtons: {
            default: null,
            type: cc.Node
        },
        chooseCowButtons: {
            default: null,
            type: cc.Node
        },
        showCowValueButton: {
            default: null,
            type: cc.Node
        },
        noCowSpriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        haveCowSpriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        cowValueBg: {
            default: null,
            type: cc.Node
        },
        cowValue: {
            default: null,
            type: cc.Node
        },
        cowValueSpriteFrames: {
            default: [],
            type: cc.SpriteFrame
        },
        cowValueSounds: {
            default: [],
            url: cc.AudioClip
        },
        playerStateLabel: {
            default: null,
            type: cc.Label
        },
        cardsStartPos: {
            default: null,
            type: cc.Node
        },
        buttonAudioClicp: {
            url: cc.AudioClip,
            default: null
        },
        fapaiSound: {
            url: cc.AudioClip,
            default: null
        }
    },
    onLoad: function () {
        this.cardsList = [];
        global.event.on('push_card', this.pushCard.bind(this));
        global.event.on('player_choose_score',this.playerChooseScore.bind(this));
        global.event.on('self_show_cow_result', this.tipCowResult.bind(this));
        global.event.on('restart_game', this.restarGame.bind(this));
        global.event.on('show_choose_cow_ui', this.chooseCowUI.bind(this));

        // global.event.on('player_show_result',this.tipCowResult.bind(this));
        this.node.active = false;
        this.state = PlayerUiNodeState.Invalide;
        this.setState(PlayerUiNodeState.Default);
        this.playerStateStr = '';
        this.timeCutDown = 0;
    },
    restarGame: function () {
        //这时候，把自己的牌删掉
        this.setState(PlayerUiNodeState.Reset);
    },
    playerChooseScore: function (data) {
        // let uid = data.uid;
        // let score = data.score;
        // if (uid === global.account.playerData.uid){
        //     this.setState(PlayerUiNodeState.ChooseCow);
        // }

    },
    pushCard: function (data) {
        console.log('push card');
        this.cardsDataList = data;
        this.setState(PlayerUiNodeState.pushCard);


    },
    chooseCowUI: function () {
        console.log('显示选择牛的ui');
        this.setState(PlayerUiNodeState.ChooseCow);
    },
    tipCowResult: function (data) {
        //收到了 服务器的 牛牛提醒
        //取出配置
        console.log('tip cow result = ' + JSON.stringify(data));
        let value = data.value;
        console.log('value = ' + value);
        // this.cowValueButton.active = true;
        this.showCowValueButton.active = true;
        if (value === 'cow0'){
            console.log('美妞');
            this.showCowValueButton.getComponent(cc.Sprite).spriteFrame = this.noCowSpriteFrame;
        }else {
            console.log('有妞');
            this.showCowValueButton.getComponent(cc.Sprite).spriteFrame = this.haveCowSpriteFrame;
        }


        let cardResult = data.cardsList;

        for (let i = 0 ; i < cardResult.length ; i ++){
            let cardData = cardResult[i];
            for (let j = 0 ; j < this.cardsList.length ; j ++){
                let card = this.cardsList[j];
                let currentData = card.getComponent('card').getData();
                console.log('current data = ' + JSON.stringify(currentData));
                console.log('card data = ' + JSON.stringify(cardData));
                if (currentData.number === cardData.number && currentData.color === cardData.color){
                    console.log('两张牌相等');
                    //数字跟花色都相等，找到了这张牌 。将这张牌提高
                    card.position = cc.p(card.position.x , 20);
                    //提高牌
                }

            }
        }
        //然后显示牛几的 label
        this.cowValueBg.active = true;
        //根据
        //取出牛牛的大小的配置f
        let value_config = global.configMap['otherConfig'].value_config;
        console.log('value config = ' + JSON.stringify(value_config));
        //取出牛的值
        let cowNumber = value_config[value];
        console.log('cow number = ' + cowNumber);
        this.cowValue.getComponent(cc.Sprite).spriteFrame = this.cowValueSpriteFrames[cowNumber];



        if (cowNumber < 11){
            cc.audioEngine.play(this.cowValueSounds[cowNumber], false, 1);
        }

        this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
            console.log('一秒之后 运行别的逻辑');
            for (let i = 0 ; i < this.cardsList.length ; i ++){
                let card = this.cardsList[i];
                card.position = cc.p(card.position.x, 0);
            }
            //


            let tempList = [this.cardsNode, this.cowValueBg];
            for (let i = 0 ; i < tempList.length ; i ++){
                let action1 = cc.moveTo(0.2, cc.p(0, -100));
                let action2 = cc.scaleTo(0.3, 0.6, 0.6);
                action2.easing(cc.easeBackInOut());
                tempList[i].runAction(action1);
                tempList[i].runAction(action2);

            }

        }.bind(this))));

    }
    ,
    createFiveCard: function (data, cb) {
        this.node.active = true;
        console.log('show card = ' + JSON.stringify(data));
        // for (let i = 0 ; i < data.length ; i ++){
        //     let card = cc.instantiate(this.cardPrefab);
        //     card.getComponent('card').initWithData(data[i]);
        //     card.parent = this.cardsNode;
        //     card.position = cc.p(135 * (5 - 1) * -0.5 + 135 * i,0);
        //     this.cardsList.push(card);
        // }
        // this.showCardsValue();
        let index = 0;
        for (let i = 0 ; i < data.length ; i ++){
            this.createOneCardWithAction(i * 0.1, data[i], cc.p(135 * (5 - 1) * - 0.5 + 135 * i, 0), function () {
                index ++;
                if (index === data.length){
                    if (cb){
                        cb();
                    }
                }
            });
        }
    },
    showCardsBg: function () {

    },
    showThreeCardValue: function () {
        for(let i = 0 ; i < 3 ; i ++){
            this.cardsList[i].getComponent('card').showCardsValue();
        }
    },
    showFourCardValue: function () {
        for (let i = 0 ; i < 4 ; i ++){
            this.cardsList[i].getComponent('card').showCardsValue();
        }
    },
    showAllCardsValue: function () {
        for (let i = 0 ; i < this.cardsList.length ; i ++){
            this.cardsList[i].getComponent('card').showCardsValue();
        }
    },
    setState: function (state) {
        if (this.state === state){
            return
        }
        switch (state){
            case PlayerUiNodeState.Default:
                this.chooseCowButtons.active = false;
                this.rateButtons.active = false;
                // this.cowValueButton.active = false;
                this.cowValueBg.active = false;
                this.showCowValueButton.active = false;
                //在默认阶段




                break;
            case PlayerUiNodeState.pushCard:
                console.log('player state push card');
                // this.showAllCardsValue();
                this.createFiveCard(this.cardsDataList, function () {
                    //创建牌面的动画结束
                    // if (this.getIsBanker()){
                    //     this.showAllCardsValue();
                    //     this.chooseCowButtons.active = true;
                    // }else {
                    //     this.rateButtons.active = true;
                    // }
                    if (!this.getIsBanker()){
                        //如果不是庄家，则进入选择倍数的状态
                        this.setState(PlayerUiNodeState.ChooseRate);
                        switch (global.account.playerData.gameData.lockRule){
                            case 'lock_card_all':

                                break;
                            case 'lock_card_1':
                                this.showFourCardValue(); //显示四张牌

                                break;
                            case 'lock_card_2':
                                this.showThreeCardValue(); //显示三张牌

                                break;
                            default:
                                break;
                        }
                        this.timeCutDown = 6;
                        this.playerStateStr = PlayerStateLabelStr.chooserate;

                    }else {
                        this.showAllCardsValue(); //显示全部的牌
                        this.timeCutDown = 6;
                        this.playerStateStr = PlayerStateLabelStr.waitplayerchooserate;
                    }

                }.bind(this));

                break;
            // case PlayerUiNodeState.ChooseRate:
            //     //选择倍数的
            //     //选择了倍数之后 显示所有的牌
            //     this.showAllCardsValue();
            //     break;
            case PlayerUiNodeState.ChooseRate:
                console.log('进入选择倍数的ui');
                this.rateButtons.active = true;
                break;
            case PlayerUiNodeState.WaitChooseRate:
                this.rateButtons.active = false;
                // this.playerStateStr = PlayerStateLabelStr.waitplayerchooserate;
                this.showAllCardsValue();
                break;
            case PlayerUiNodeState.ChooseCow:

                console.log('进入选择牛的状态');
                // if (this.getIsBanker()){
                //         this.showAllCardsValue();
                //         this.chooseCowButtons.active = true;
                //     }else {
                //         this.rateButtons.active = true;
                //     }

                this.showAllCardsValue();
                this.chooseCowButtons.active = true;
                this.playerStateStr = PlayerStateLabelStr.qingliangpai;
                this.timeCutDown = 13;

                break;
            // case PlayerUiNodeState.ShowCow:
            //
            //     if (global.account.playerData.uid !== global.account.playerData.bankerID){
            //         this.rateButtons.active = false;
            //     }
            //     this.chooseCowButtons.active = true;
            //     this.showAllCardsValue();
            //
            //     break;
            case PlayerUiNodeState.ShowScore:
                break;
            case PlayerUiNodeState.Reset:

                console.log('玩家自己的页面设置成初始状态');
                //把牌都删掉
                for (let i = 0 ; i < this.cardsList.length ; i ++){
                    this.cardsNode.removeChild(this.cardsList[i]);
                    //删掉之后 牛牛 也删掉
                }
                this.cardsList = [];

                this.cowValueBg.active = false;
                this.cowValueBg.scale = 1;
                this.cardsNode.scale = 1;
                this.cardsNode.position = cc.p(0,-250);
                this.cowValueBg.position = cc.p(0, -250);

                //ui按钮设置成初始状态
                this.chooseCowButtons.active = false;
                this.rateButtons.active = false;
                this.showCowValueButton.active = false;

                break;
            default:
                break;
        }
        this.state = state;
    },
    onButtonClick: function (event, customData) {
        if (!global.account.playerData.soundOff){
            cc.audioEngine.play(this.buttonAudioClicp, false, 1);
        }
        if (customData.indexOf('rate') !== -1){
            console.log('玩家点击了倍数的按钮');
            //点击之后，将ui状态设置成等待其他玩家的状态
            this.setState(PlayerUiNodeState.WaitChooseRate);
            this.timeCutDown = 0;
        }

        switch (customData){
            case "rate_1":
                // global.socket.emit('choose_score', 1);
                global.socketControl.chooseScore(1);
                break;
            case "rate_2":
                // global.socket.emit('choose_score', 2);
                global.socketControl.chooseScore(2);


                break;
            case "rate_3":
                // global.socket.emit('choose_score', 3);
                global.socketControl.chooseScore(3);

                break;
            case "rate_4":
                // global.socket.emit('choose_score', 4);
                global.socketControl.chooseScore(4);

                break;
            case "rate_5":
                // global.socket.emit('choose_score', 5);
                global.socketControl.chooseScore(5);

                break;
            case "tipsButton":
                // global.socket.emit('tips_cow');
                global.socketControl.tipsCow();
                this.timeCutDown = 0;
                break;
            default:
                break;
        }
    },
    getIsBanker: function () {
        if (global.account.playerData.uid === global.account.playerData.bankerID){
            return true;
        }
        return false;
    },
    createOneCardWithAction: function (delayTime, data, pos, cb) {

        let node = cc.instantiate(this.cardPrefab);
        node.scale = {
            x: 0.1,
            y: 0.1
        };
        node.parent = this.cardsNode;
        node.getComponent('card').initWithData(data);
        node.position = this.cardsStartPos.position;
        this.cardsList.push(node);
        let action = cc.sequence(cc.delayTime(delayTime),cc.callFunc(function () {
            cc.audioEngine.play(this.fapaiSound, false, 1);
            let moveTo = cc.moveTo(0.2, pos);
            let scaleTo = cc.scaleTo(0.2, 0.9,0.9);
            node.runAction(scaleTo);
            node.runAction(cc.sequence(moveTo, cc.delayTime(0.1), cc.callFunc(function () {
                if (cb){
                    cb();
                }
            })));
        }.bind(this)));
        node.runAction(action);
    },
    update: function (dt) {
        if (this.timeCutDown > 0){
            this.timeCutDown -= dt;
            if (this.timeCutDown <= 0){
                console.log('倒计时结束');
                this.timeCutDownEnd();
                this.timeCutDown = 0;
            }
            this.playerStateLabel.string = this.playerStateStr + Math.floor(this.timeCutDown);
        }else {
            this.playerStateLabel.string = '';
        }
    },
    timeCutDownEnd: function () {
        console.log('this.state = ' + this.state);
        switch (this.state){
            case PlayerUiNodeState.ChooseRate:
                //如果状态时 发牌的花
                //直接给玩家操作选择一倍
                console.log('并且状态时发牌的状态的时候');
                global.socketControl.chooseScore(1);
                this.setState(PlayerUiNodeState.WaitChooseRate); //进入等待其他玩家选择倍数的，


                break;
            case PlayerUiNodeState.ChooseCow:
                //到及时结束的时候，要直接选妞
                global.socketControl.tipsCow();
                this.timeCutDown = 0;
                break;
            default:
                break;
        }
    }

});

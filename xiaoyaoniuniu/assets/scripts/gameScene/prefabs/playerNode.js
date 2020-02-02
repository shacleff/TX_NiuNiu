import global from "../../global";

const PlayerNodeState = {
    Invalide: -1,
    Waitting: 1,
    Ready: 2,
    PushCard: 3,
    ShowCard: 4,
    Default: 5
};
cc.Class({
    extends: cc.Component,

    properties: {
        headImage: {
          default: null,
          type: cc.Node
        },
        nickNameNode: {
            default: null,
            type: cc.Node
        },
        nickNameLabel: {
            default: null,
            type: cc.Label
        },
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        bankerIconNode: {
            default: null,
            type: cc.Node
        },
        readyIconNode: {
            default: null,
            type: cc.Node
        },
        leaveIconNode: {
            default: null,
            type: cc.Node
        },
        cardPrefab: {
            default: null,
            type: cc.Prefab
        },
        startPosNode: {
            default: null,
            type: cc.Node
        },
        endPosNode: {
            default: null,
            type: cc.Node
        },
        cowValueSpriteFrames: {
            default: [],
            type: cc.SpriteFrame
        },
        scoreStartPos: {
            default: null,
            type: cc.Node
        },
        chooseScoreBg: {
            default: null,
            type: cc.Node
        },
        chooseScoreLabel: {
            default: null,
            type: cc.Label
        },
        ipLabel: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {
        this.state = PlayerNodeState.Invalide;
        this.cardsList = [];
        this.setState(PlayerNodeState.Waitting);
        this.isShowIping = false;
        this.ipLabel.node.opacity = 0;

    },
    initPlayerNode: function (data, config) {
        console.log('init player node = ' + JSON.stringify(data));
        console.log('config = ' + JSON.stringify(config));
        this.ipLabel.string = 'ip' + data.ip.substring(6,data.ip.length);
        this.uid = data.uid;
        let widget = this.addComponent(cc.Widget);
        let widgetConfig = config["widget"];
        for (let i in widgetConfig) {
            // widget[widgetConfig[i]]
            let direction = widgetConfig[i].direction;
            let offset = widgetConfig[i].offset;
            switch (direction) {
                case 'left':
                    widget.isAlignLeft = true;
                    break;
                case 'right':
                    widget.isAlignRight = true;
                    break;
                case 'top':
                    widget.isAlignTop = true;
                    break;
                case 'bottom':
                    widget.isAlignBottom = true;
                    break;
                default:
                    break;
            }
            widget[direction] = offset;
        }
        widget.updateAlignment();
        this.initPlayerNodeUi(data, config);
    },
    initPlayerNodeUi: function (data, config) {
        //首先显示个个数据
        let position = config.nickNameNodePos;
        console.log('nick name node position = ' + JSON.stringify(position));
        this.nickNameNode.position = cc.v2(position.x, position.y);
        this.bankerIconNode.position = cc.v2(config.bankerIconPos.x, config.bankerIconPos.y);
        this.scoreLabel.string = data.score;
        this.nickNameLabel.string = data.nickName;
        this.bankerIconNode.active = false;
        this.startPosNode.position = cc.v2(config.cardsStartPos.x, config.cardsStartPos.y);
        this.endPosNode.position = cc.v2(config.cardsEndPos.x, config.cardsEndPos.y);
        this.chooseScoreBg.position = cc.v2(config.chooseScoreBgEndPos.x, config.chooseScoreBgEndPos.y);
        this.chooseScoreLabel.node.position = cc.v2(config.chooseScoreNodePos.x, config.chooseScoreNodePos.y);
        console.log('头像地址是 =' + data.avatar);
        let remoteUrl = data.avatar
        // let remoteUrl = "https://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0";
        cc.loader.load({url: remoteUrl, type: 'png'},  (err, texture)=> {
            // Use texture to create sprite frame
            if (err){
                console.log('err = ' + err);
            }else {
                let oldWidth = this.headImage.width;
                console.log('old width = ' + oldWidth);
                this.headImage.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                console.log('now width = ' + this.headImage.width);
                // this.headImage.scale = 0.15;
            }
        });
    },
    pushCard: function () {
        console.log('player node push card');
        //推送牌面；
        //收到牌之后延迟0.3秒发牌
        // console.log('延迟0.3秒发牌');
        // setTimeout(function () {
        //     this.setState(PlayerNodeState.PushCard);
        // }.bind(this),300);
        this.node.runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(function () {
            this.setState(PlayerNodeState.PushCard);
        }.bind(this))));

    },
    getUid: function () {
        return this.uid;
    },
    gameStart: function () {
        console.log('game start');
        //游戏开始
        console.log('uid  = ' + this.uid);
        console.log('banker id = ' + global.account.playerData.bankerID);
        this.setState(PlayerNodeState.Waitting);

    },
    setState: function (state) {
        if (this.state === state) {
            return;
        }
        switch (state) {
            case PlayerNodeState.Waitting:

                this.readyIconNode.active = false;
                this.bankerIconNode.active = false;
                this.leaveIconNode.active = false;
                this.chooseScoreBg.active = false;
                //离线的先隐藏

                break;
            case PlayerNodeState.Ready:
                console.log('准备状态');
                this.bankerIconNode.active = false;
                this.readyIconNode.active = true;
                this.chooseScoreBg.active = false;
                for (let i = 0; i < this.cardsList.length; i++) {
                    this.node.removeChild(this.cardsList[i]);
                }
                this.cardsList = [];

                if (!!this.cowValueNode) {
                    this.cowValueNode.destroy();
                }
                break;
            case PlayerNodeState.PushCard:
                if (global.account.playerData.uid !== this.uid) {
                    this.createFiveCards();
                }
                this.readyIconNode.active = false;
                if (this.getUid() === global.account.playerData.bankerID) {
                    this.bankerIconNode.active = true;
                }
                break;
            case PlayerNodeState.ShowCard:
                if (global.account.playerData.uid !== this.uid) {
                    this.showAllCardsValue(this.cowCardResult.cardsList);
                    this.showCowValue(this.cowCardResult.cowValue);
                }

                break;
            case PlayerNodeState.Default:
                // this.bankerIconNode.active = false;
                // this.readyIconNode.active = false;
                // for (let i = 0 ; i < this.cardsList.length ; i ++){
                //     this.node.removeChild(this.cardsList[i]);
                // }
                // this.cardsList = [];
                //
                // if (!!this.cowValueNode){
                //     this.cowValueNode.destroy();
                // }
                break;
            default:
                break;
        }
        this.state = state;
    },
    createFiveCards: function () {
        //创建五张牌
        let index = 0;
        for (let i = 0; i < 5; i++) {
            this.createOneFiveCard(i * 0.1, cc.v2(this.endPosNode.x,this.endPosNode.y).add(cc.v2(i * 30 + (5 - 1) * -0.5 * 30, 0)), function () {
                index++;
                if (index === 5) {
                    console.log('加载完成');
                }
            });
        }
    },
    createOneFiveCard: function (delayTime, pos, cb) {
        let card = cc.instantiate(this.cardPrefab);
        card.scale = 0;
        card.parent = this.node;
        card.position = this.startPosNode.position;
        let seq = cc.sequence(cc.delayTime(delayTime), cc.callFunc(function () {
            let action1 = cc.moveTo(0.4, pos);
            let action2 = cc.scaleTo(0.4, 0.6);
            card.runAction(action1);
            card.runAction(action2);
            if (cb) {
                cb();
            }
        }));
        card.runAction(seq);
        this.cardsList.push(card);
    },
    getIsBanker: function () {
        if (global.account.playerData.uid === global.account.playerData.bankerID) {
            return true;
        }
        return false;
    },
    showGameResult: function (data) {
        //展示游戏数据


    },
    showAllCardsValue: function (data) {
        //展示所有牌的值
        if (this.cardsList.length === 0) {
            console.log('列表长度');
            return
        }
        console.log('shao all cards value');
        for (let i = 0; i < data.length; i++) {
            let cardData = data[i];
            let card = this.cardsList[i];
            card.getComponent('card').showCardsValue(cardData);
            // card.sh
        }
    },
    showCowValue: function (data) {
        //展示牛几的值
        let cowValueConfig = global.configMap.otherConfig.value_config;
        let cowNumber = cowValueConfig[data];
        let spriteFrame = this.cowValueSpriteFrames[cowNumber];
        this.cowValueNode = new cc.Node('cowNode');
        this.cowValueNode.parent = this.node;
        this.cowValueNode.scale = 0.6;

        this.cowValueNode.position = this.endPosNode.position;
        this.cowValueNode.addComponent(cc.Sprite).spriteFrame = spriteFrame;
    },
    showCowCardResult: function (data) {
        this.cowCardResult = data;
        console.log('cow card result' + JSON.stringify(data));
        if (this.uid === data.uid) {
            this.setState(PlayerNodeState.ShowCard);
        }

    },
    setDefaultState: function () {
        //回到初始状态
        this.setState(PlayerNodeState.Default);
    },
    somePlayerReady: function (data) {
        //有人准备了
        if (this.uid === data.uid) {
            //是我准备了，我自己设置成准备状态
            this.setState(PlayerNodeState.Ready);
        }

    },
    playerChooseScore: function (data) {
        if (this.getUid() === data.uid) {
            this.chooseScoreBg.active = true;
            this.chooseScoreBg.scale = 2;
            let action = cc.scaleTo(0.4, 1);
            action.easing(cc.easeBackInOut());
            this.chooseScoreBg.runAction(cc.sequence(action, cc.callFunc(() => {
                this.chooseScoreLabel.string = data.score + '';
            })));

        }
    },
    updateScore: function (data) {
        //更新分数
        console.log('update score = ' + JSON.stringify(data));

        for (let i = 0 ; i < data.length ; i++){
            let playerData = data[i];
            if (playerData.uid === this.uid){
                this.scoreLabel.string = playerData.score + '';
            }
        }
    },
    playerOffLine: function (data) {
        if (data.uid === this.uid){
            //这个玩家掉线了
            // this.
            this.leaveIconNode.active = true;
        }
    },
    playerOnLine: function (data) {
        console.log('玩家重新链接了' + JSON.stringify(data));
        console.log('this uid = ' + this.uid);
        if (data.uid === this.uid){
            this.leaveIconNode.active = false;
        }
        if (data.uid === global.account.playerData.bankerID){
            this.bankerIconNode.active = true;
            this.chooseScoreBg.active = false;
        }else {
            this.bankerIconNode.active = false;
            this.chooseScoreBg.active = true;
        }
    },
    syncPlayerChooseScore: function (data) {
        //同步玩家选择的分数
        for (let i = 0 ; i < data.length ; i ++){
            this.playerChooseScore(data[i]);
        }
    },
    onButtonClick: function (event, customData) {
        switch (customData){
            case 'click':
                console.log('点击头像了');
                if (this.isShowIping){
                    return
                }
                this.isShowIping = true;
                this.ipLabel.node.opacity = 255;
                let seq = cc.sequence(cc.delayTime(1), cc.fadeOut(1), cc.callFunc(()=>{
                    this.isShowIping = false;
                }));
                this.ipLabel.node.runAction(seq);
                break;
            default:
                break;
        }
    },
    onDestroy: function () {

    }
});

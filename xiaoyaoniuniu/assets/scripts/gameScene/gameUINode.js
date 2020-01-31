import global from './../global'
cc.Class({
    extends: cc.Component,

    properties: {
        houseIdLabel: {
            default: null,
            type: cc.Label
        },
        houseCountLabel: {
            default: null,
            type: cc.Label
        },
        bankerRuleLabel: {
            default: null,
            type: cc.Label
        },
        lockRuleLabel: {
            default: null,
            type: cc.Label
        },
        specialLabel: {
            default: null,
            type: cc.Label
        },
        rateLabel: {
            default: null,
            type: cc.Label
        },
        waitNode: {
            default: null,
            type: cc.Node
        },
        startGameButton: {
            default: null,
            type: cc.Node
        },
        lastRoundCountLabel: {
            default: null,
            type: cc.Label
        },
        endRoomPrefab: {
            default: null,
            type: cc.Prefab
        },
        endRoomChoosePrefab: {
            default: null,
            type: cc.Prefab
        },
        buttonAudioClicp: {
            url: cc.AudioClip,
            default: null
        }
    },

    // use this for initialization
    onLoad: function () {
        global.event.on('init_room_info', this.initRoomInfo.bind(this));
        global.event.on('game_start',this.gameStart.bind(this));
        global.event.on('refersh_ui',this.referShUI.bind(this));
        global.event.on('init_game_data',this.initGameData.bind(this));
        global.event.on('show_end_room_choose', this.showEndRoomChoose.bind(this));
        global.event.on('player_cancel_end_room', this.playerCancelEndRoom.bind(this));
        // global.event.on('init_player_node_config',)


        if (cc.sys.isMobile){
            var agent = anysdk.agentManager;
            // var share_plugin = agent.getSharePlugin();
            this.sharePlugin = agent.getSharePlugin();
            this.sharePlugin.setListener(this.shareListener.bind(this), this);
        }
    },
    
    gameStart: function (data) {
        //游戏开始
        console.log('游戏开始了' + JSON.stringify(data));


        this.waitNode.active = false;
        // this.roundCount = data.roundCount;
        this.lastRoundCountLabel.string = data.lastRoundCount + '';

        //剩余轮数
    },
    shareListener: function (code, msg) {
        console.log('shaer code = ' + code);
        console.log('share msh = ' + msg);
        switch (code){
            case anysdk.ShareResultCode.kShareSuccess:
                console.log('分享成功了');

                break;
            case anysdk.ShareResultCode.kShareFail:
                console.log('分享失败了');
                break;
            case anysdk.ShareResultCode.kShareCancel:
                console.log('取消分享了');
                break;
            case anysdk.ShareResultCode.kShareNetworkError:
                console.log('网络错误');
                break;
            default:
                break;
        }
    },

    initGameData: function (data) {
        //初始化游戏数据
        console.log('初始化玩家数据' + JSON.stringify(data));
        console.log('剩余轮数是' + data.roundCount);
        this.lastRoundCountLabel.string = data.roundCount + '';
    },
    referShUI: function (data) {
        let playerCount = data.playerCount;
        //房间里面玩家超过2  并且自己是房主的情况下，玩家可以点击开始游戏
        console.log('house manager = ' + global.account.playerData.gameData.houseManagerID);
        console.log('uid = ' + global.account.playerData.uid);
        if (playerCount > 1 && global.account.playerData.gameData.houseManagerID === global.account.playerData.uid){
            this.startGameButton.active = true;
        }else {
            if (this.startGameButton.active){
                this.startGameButton.active = false;
            }
        }
    },
    initRoomInfo: function () {
        let data = global.account.playerData.gameData;
        console.log('init room info = ' + JSON.stringify(data));
        for (let i in data) {
            console.log('i = ' + i + ":" + JSON.stringify(data[i]));
        }
        // console.log('enter room success = ' + JSON.stringify(data));
        let gameConfig = global.configMap.gameConfig;
        let nameConfig = global.configMap.otherConfig.name_config;
        console.log('name config = ' + JSON.stringify(nameConfig));
        this.houseIdLabel.string = data.roomId;
        this.houseCountLabel.string = data.roundCount + '局';
        // console.log('banker rule = ')
        console.log('banker rule = ' + data.bankerRule);
        this.bankerRuleLabel.string = nameConfig[data.bankerRule];
        this.lockRuleLabel.string = nameConfig[data.lockRule];
        let specialRule = gameConfig['special_card'][data.specicalType];
        console.log('specail rule  = ' + JSON.stringify(specialRule));
        let specialStr = '';
        for (let i in specialRule) {
            console.log('i = ' + i);
            let name = nameConfig[i];
            console.log('name = ' + name);
            specialStr += nameConfig[i] + 'X' + specialRule[i];
        }
        console.log('special str = ' + specialStr);
        this.specialLabel.string = specialStr;


        console.log('rate rule' + data.rateRule);
        let rateRuleStr = '';
        let rateRule = gameConfig['rate_count'][data.rateRule];
        console.log('rate rule = ' + JSON.stringify(rateRule));
        for (let i in rateRule) {
            rateRuleStr += nameConfig[i] + 'X' + rateRule[i];
        }
        this.rateLabel.string = rateRuleStr;


    },
    showEndRoomChoose: function () {
        console.log('展示结束房间选择的页面');
        this.endRoomChoose = cc.instantiate(this.endRoomChoosePrefab);
        this.endRoomChoose.parent = this.node;
    },
    onButtonClick: function (event, customData) {
        if (!global.account.playerData.soundOff){
            cc.audioEngine.play(this.buttonAudioClicp, false, 1);
        }
        switch (customData){
            case 'startGame':
                //游戏开始
                console.log('游戏开始按钮点击');
                // global.socket.emit('game_start');
                global.socketControl.gameStart();
                break;
            case 'end_room':
                console.log('解散房间');
                // global.socketControl.endRoom();
                let node = cc.instantiate(this.endRoomPrefab);
                node.parent = this.node;
                break;
            case 'share':
                console.log('分享按钮');
                // global.userPlugin.
                this.sharePlugin.share({
                    shareTo: '0',
                    title: '小小牛牛',
                    text: '我在小小牛牛房间号：' + global.account.playerData.gameData.roomId + ',一起来玩吧!',
                    mediaType: '0'
                });
                break;
            default:
                break;
        }
    },
    playerCancelEndRoom: function () {
        if (this.endRoomChoose){
            this.endRoomChoose.destroy();
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

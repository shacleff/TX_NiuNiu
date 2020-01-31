import global from './../global'
import defines from './../defines'
// var SocketControl = require('./socket-controller');
cc.Class({
    extends: cc.Component,

    properties: {
        playerNodePrefab: {
            default: null,
            type: cc.Prefab
        },
        turnGameOverScoreResult: {
            default: null,
            type: cc.Prefab
        },
        gameEndResultPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {
        this.playerNodeList = [];
        //登录socket
        let loadCount = 0;
        let index = 0;
        const loadEnd = function (key, result) {
            global.configMap[key] = result;
            loadCount++;
            if (loadCount === index) {
                //如果加载资源成功的次数 等于总资源的个数 ，说明加载完成
                //加载完成
                console.log('加载完成' + JSON.stringify(global.configMap));
                this.initRoomData();
            }
        }.bind(this);

        const loadRes = function (key, value) {
            cc.loader.loadRes(value, function (err, result) {
                if (err) {
                    console.log('err = ' + err)
                } else {
                    console.log('result = ' + JSON.stringify(result));
                    loadEnd(key, result);
                }
            }.bind(this));
        };

        ///加载配置资源

        for (let i in defines.configMap) {
            index++;
            loadRes(i, defines.configMap[i]);
        }

        //出去玩家坐标位置信息
        // cc.loader.loadRes('/config/player-node-pos-config', function (err, result) {
        //     if (err){
        //         console.log('err = ' + err);
        //     }else {
        //         console.log('result = ' + JSON.stringify(result));
        //         this.playerNodePosConfig = result;
        //     }
        // }.bind(this));
        // global.event.on('init_player_node_config',this.initPlayerNodePosConfig.bind(this));
        global.event.on('re_enter_room',this.reEnterRoom.bind(this));
        global.event.on('sync_data', this.syncData.bind(this));
        global.event.on('add_player', function (data) {
            console.log('添加一个玩家' + JSON.stringify(data));
            this.addPlayerNode(data);
        }.bind(this));
        global.event.on('player_leave', this.removePlayerNode.bind(this));
        global.event.on('push_card', this.pushCard.bind(this));
        global.event.on('player_show_result', this.showPlayerResult.bind(this));
        global.event.on('turn_game_score_result', this.showTurnGameResult.bind(this));
        global.event.on('restart_game', this.restartGame.bind(this));
        global.event.on('some_player_ready', this.somePlayerReady.bind(this));
        global.event.on('game_end_result', this.gameEndResult.bind(this));
        global.event.on('player_choose_score', this.playerChooseScore.bind(this));
        global.event.on('room_end', this.roomEnd.bind(this));
        global.event.on('player_offline', this.playerOffLine.bind(this));
        global.event.on('player_online', this.playerOnLine.bind(this));
        global.event.on('sync_player_choose_score', this.syncPlayerChooseScore.bind(this));
    },


    reEnterRoom: function () {
        cc.director.loadScene('gameScene');
    },

    initRoomData: function () {
        //所有的资源都加载好了 ， 这时候 初始化房间信息
        let data = global.account.playerData.gameData;
        console.log('初始化游戏数据' + JSON.stringify(data));
        global.event.fire('init_room_info');
        //同步用户数据
        this.initPlayerNodePosConfig({seatId: global.account.playerData.gameData.seatId});
        //根据同步数据创建玩家
        //这时候请求发送请求发送的消息
        global.socketControl.requestSycnData();

    },
    initPlayerNodePosConfig: function (data) {
        let seatId = data.seatId;
        console.log('根据玩家所在的位置 重新排列' + seatId);
        let playerNodePosConfig = global.configMap.playerNodePos;
        this.currentPlayerNodePosConfig = [];
        switch (seatId) {
            case 0:
                this.currentPlayerNodePosConfig[0] = playerNodePosConfig["1"];
                this.currentPlayerNodePosConfig[1] = playerNodePosConfig["2"];
                this.currentPlayerNodePosConfig[2] = playerNodePosConfig["3"];
                this.currentPlayerNodePosConfig[3] = playerNodePosConfig["4"];

                break;
            case 1:
                this.currentPlayerNodePosConfig[0] = playerNodePosConfig["2"];
                this.currentPlayerNodePosConfig[1] = playerNodePosConfig["1"];
                this.currentPlayerNodePosConfig[2] = playerNodePosConfig["4"];
                this.currentPlayerNodePosConfig[3] = playerNodePosConfig["3"];
                break;
            case 2:
                this.currentPlayerNodePosConfig[0] = playerNodePosConfig["3"];
                this.currentPlayerNodePosConfig[1] = playerNodePosConfig["4"];
                this.currentPlayerNodePosConfig[2] = playerNodePosConfig["1"];
                this.currentPlayerNodePosConfig[3] = playerNodePosConfig["2"];

                break;
            case 3:
                this.currentPlayerNodePosConfig[0] = playerNodePosConfig["4"];
                this.currentPlayerNodePosConfig[1] = playerNodePosConfig["3"];
                this.currentPlayerNodePosConfig[2] = playerNodePosConfig["2"];
                this.currentPlayerNodePosConfig[3] = playerNodePosConfig["1"];

                break;
            default:
                break;
        }
    },
    syncData: function (data) {
        //同步数据
        console.log('sycn data' + JSON.stringify(data));
        for (let i = 0; i < data.length; i++) {
            this.addPlayerNode(data[i]);
        }
    },
    addPlayerNode: function (data) {
        let seatId = data.seatId;
        console.log('add player seat id = ' + seatId);
        //创建一个玩家
        let playerNode = cc.instantiate(this.playerNodePrefab);
        playerNode.parent = this.node;
        playerNode.getComponent('playerNode').initPlayerNode(data, this.currentPlayerNodePosConfig[seatId]);
        this.playerNodeList.push(playerNode);
        global.event.fire('refersh_ui', {
            playerCount: this.playerNodeList.length
        })
    },
    removePlayerNode: function (uid) {
        for (let i = 0; i < this.playerNodeList.length; i++) {
            if (this.playerNodeList[i].getComponent('playerNode').getUid() === uid) {
                this.node.removeChild(this.playerNodeList[i]);
                this.playerNodeList[i].destroy();
                this.playerNodeList.splice(i, 1);

            }
        }
        global.event.fire('refersh_ui', {playerCount: this.playerNodeList.length});
        //刷新ui
    },
    pushCard: function () {
        for (let i = 0; i < this.playerNodeList.length; i++) {
            this.playerNodeList[i].getComponent('playerNode').pushCard();
        }
    },
    showPlayerResult: function (data) {
        //显示玩家的结果
        console.log('展示游戏结果' + JSON.stringify(data) + 'length = ' + this.playerNodeList.length);
        for (let i = 0; i < this.playerNodeList.length; i++) {
            let player = this.playerNodeList[i];
            console.log('显示游戏结果');
            player.getComponent('playerNode').showCowCardResult(data);
            //玩家显示牌以及牛几Card
        }
    },
    playerChooseScore: function (data) {
        //有玩家选择了倍数
        for (let i = 0; i < this.playerNodeList.length; i++) {
            let playerNode = this.playerNodeList[i];
            playerNode.getComponent('playerNode').playerChooseScore(data);
        }
    },
    showTurnGameResult: function (data) {
        //展示游戏解决
        //
        console.log('收到了游戏结果的通知' + JSON.stringify(data));
        global.turnGameResult = data;
        let node = cc.instantiate(this.turnGameOverScoreResult);
        node.parent = this.node;
        for (let i = 0; i < this.playerNodeList.length; i++) {
            let player = this.playerNodeList[i].getComponent('playerNode').updateScore(data);
        }
    },
    restartGame: function () {
        //重新开始
        //所有玩家回到初始状态
        // for (let i = 0 ; i < this.playerNodeList.length ; i ++){
        //     let playerNode = this.playerNodeList[i];
        //     playerNode.getComponent('playerNode').setDefaultState();
        // }
    },
    somePlayerReady: function (data) {
        console.log('有些人准备了' + JSON.stringify(data));
        for (let i = 0; i < this.playerNodeList.length; i++) {
            this.playerNodeList[i].getComponent('playerNode').somePlayerReady(data);
        }
    },
    gameEndResult: function (data) {
        console.log('游戏结束的时候的结果' + JSON.stringify(data));
        global.account.playerData.gameEndResultData = data; //游戏结果
        let gameEndResult = cc.instantiate(this.gameEndResultPrefab);
        gameEndResult.parent = this.node;
    },
    update: function (dt) {
        // global.socketControl.heart(dt);
    },
    roomEnd: function () {
        cc.director.loadScene('mainScene');
    },
    playerOffLine: function (data) {
        console.log('有玩家掉线了' + JSON.stringify(data));
        for (let i = 0 ; i < this.playerNodeList.length ; i ++){
            let player = this.playerNodeList[i];
            player.getComponent('playerNode').playerOffLine(data);
        }
    },
    playerOnLine: function (data) {
        console.log('玩家重连了');
        for (let i = 0 ; i < this.playerNodeList.length ; i ++){
            let player = this.playerNodeList[i];
            player.getComponent('playerNode').playerOnLine(data);
        }
    },
    syncPlayerChooseScore: function (data) {
        for (let i = 0 ; i < this.playerNodeList.length ; i ++){
            let player = this.playerNodeList[i];
            player.getComponent('playerNode').syncPlayerChooseScore(data);
        }
    },
    onDestroy: function () {
        global.event.removeAllListeners();
    }
});

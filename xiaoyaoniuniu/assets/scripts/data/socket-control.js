import global from './../global'
import  defines from './../defines'
const SocketControl = function () {
    let that = {};
    console.log('socket io ' + JSON.stringify(defines.socketUrl));
    that.socket = io(defines.socketUrl);

    const getJSONData = function (data) {
        if (typeof data === 'string') {
            return JSON.parse(data);
        }
        return data;
    };

    const login = function () {
        that.socket.emit('login', {
            // uid: global.account.playerData.uid,
            auth: global.account.playerData.auth,
            nickName: global.account.playerData.nickName,
            avatarUrl: global.account.playerData.avatarUrl
        });
    };


    that.socket.on('connected', function () {
        cc.log('连接成功');
        login();

    });
    const reEnterRoom = function (data) {
        console.log('重新进入房间' + JSON.stringify(data));
        data = getJSONData(data);
        global.account.playerData.gameData = data;
        global.event.fire('re_enter_room');
    };
    const joinRoomFail = function (data) {
        console.log('加入房间失败');
        global.event.fire('join_room_fail', data);
    };
    const initData = function (data) {
        //收到用户数据的时候 ，进入游戏场景
        data = getJSONData(data);
        console.log('初始化用户数据' + JSON.stringify(data));
        global.account.playerData.gameData = data;
        global.event.fire('enter_room');
    };
    const syncData = function (data) {
        data = getJSONData(data);
        console.log('同步数据' + JSON.stringify(data));
        // global.account.playerData.syncData = data;
        global.event.fire('sync_data', data);
    };
    const playerJoinRoom = function (data) {
        console.log('玩家加入房间');
        data = getJSONData(data);
        global.event.fire('add_player', data);
    };
    const playerLeave = function () {
        console.log('玩家离开房间');
    };
    const gameStart = function (data) {
        console.log('游戏开始');
        console.log('游戏开始 ' + JSON.stringify(data));
        data = getJSONData(data);
        global.account.playerData.bankerID = data.bankerId;
        global.account.playerData.lastRoundCount = data.lastRoundCount; //房间剩余的轮数
        global.event.fire('game_start', data);
    };
    const pushCards = function (cards) {
        cards = getJSONData(cards);
        console.log('发牌');
        console.log('收到了一手牌' + JSON.stringify(cards));

        global.event.fire('push_card', cards);
    };
    const changeHouseManager = function () {
        console.log('改变房主');
    };
    const playerChooseScore = function (data) {
        console.log('玩家选择了分数');
        data = getJSONData(data);
        global.event.fire('player_choose_score', data);
    };
    const showSelfCowResult = function (data) {
        console.log('展示自己选牛的结果');
        data = getJSONData(data);
        console.log('show seld cow result' + JSON.stringify(data));
        global.event.fire('self_show_cow_result', data);
    };
    const playerShowResult = function (data) {
        console.log('显示玩家的结果');
        data = getJSONData(data);
        // console.log('牛牛提示的反馈' + JSON.stringify(data));
        global.event.fire('player_show_result', data);
    };
    const showGameResult = function (data) {
        console.log('显示游戏结果');
        data = getJSONData(data);
        console.log('show game result =' + JSON.stringify(data));
        global.event.fire('show_game_result', data);

    };
    const turnGameScoreResult = function (data) {
        console.log('一回合结束的结果');
        data = getJSONData(data);
        console.log('收到了游戏分数结果' + JSON.stringify(data));
        global.event.fire('turn_game_score_result', data);
    };
    const somePlayerReady = function (data) {
        console.log('有玩家准备了');
        data = getJSONData(data);
        console.log('有人准备了' + JSON.stringify(data));
        global.event.fire('some_player_ready', data);
    };
    const canChooseCow = function () {
        console.log('可以选择牛了');
        console.log('玩家可以选择牛了');
        global.event.fire('show_choose_cow_ui');
    };
    const gameEndResult = function (data) {
        console.log('游戏最终结果');
        data = getJSONData(data);
        console.log('游戏结束时候的结果' + JSON.stringify(data));
        global.event.fire('game_end_result', data);
    };
    const disconnect = function () {
        console.log('断开连接');
    };

    const loginResult = function (data) {
        console.log('链接成功' + JSON.stringify(data));
        data = getJSONData(data);
        global.account.playerData.nickName = data.nickName;
        global.account.playerData.uid = data.uid;
        global.account.playerData.avatarUrl = data.avatarUrl;
        global.account.playerData.houseCardCount = data.houseCardCount;
        global.event.fire("login_success", data);
    };

    const playerEndRoom = function (data) {
        data = getJSONData(data);
        console.log('有玩家想要解散房间' + JSON.stringify(data));
        global.account.playerData.endRoomPlayerNickName = data.nickName;
        global.event.fire('show_end_room_choose');
    };

    const playerCancelEndRoom = function () {
        global.event.fire('player_cancel_end_room');
    };
    const roomEnd = function () {
        global.event.fire('room_end');
    };
    const playerOffLine = function (data) {
        data = getJSONData(data);
        console.log('收到玩家掉线的消息' + JSON.stringify(data));
        global.event.fire('player_offline', data);
    };
    const playerOnLine = function (data) {
        data = getJSONData(data);
        console.log('收到了玩家重新链接的消息' + JSON.stringify(data));
        global.event.fire('player_online', data);
    };
    const sycnPlayerChooseScore = function (data) {
        data = getJSONData(data);
        console.log('同步所有玩家选择的分数' + JSON.stringify(data));
        global.event.fire('sync_player_choose_score', data);
    };
    const syncHouseCardCount = function (data) {
        data = getJSONData(data);
        global.account.playerData.houseCardCount = data.houseCardCount;
        //刷新一下房卡的数目
    };
    const rebackPlayerGameRecord = function (data) {
      //返回玩家游戏记录
        data = getJSONData(data);
        console.log('玩家记录的返回' + JSON.stringify(data));
        global.event.fire('reback_player_game_record', data);
    };

    const rebackRoomGameRecord = function (data) {
        data = getJSONData(data);
        console.log('玩家返回的房间游戏数据' + JSON.stringify(data));
        global.event.fire('reback_room_game_record', data);
    };
    that.createRoom = function (data) {
        console.log('创建房间' + JSON.stringify(data));
        that.socket.emit('create_room', data);// 创建房间
    };
    that.joinRoom = function (roomId) {
        that.socket.emit('join_room', roomId);
    };
    that.requestSycnData = function () {
        that.socket.emit('request_sync_data');
    };
    that.gameStart = function () {
        that.socket.emit('game_start');
    };
    that.chooseScore = function (data) {
        console.log('choose score  =' + data);
        that.socket.emit('choose_score', data);
    };
    that.tipsCow = function () {
        that.socket.emit('tips_cow');
    };
    that.restartGame = function () {
        global.event.fire('restart_game');
        that.socket.emit('restart_game');
    };
    that.endRoom = function () {
        that.socket.emit('end_room');
    };
    that.chooseEndRoom = function (data) {
        that.socket.emit('choose_end_room', data);
    };
    that.cancelEndRoom = function () {
        that.socket.emit('cancel_end_room');
    };
    that.requestPlayerRecord = function () {
        //请求玩家的游戏记录
        that.socket.emit('request_player_record');
    };
    that.requestRoomRecord = function (roomID) {
        console.log('请求房间数据' + roomID);
        that.socket.emit('request_room_record',roomID);
    };

    that.socket.on('reback_room_game_record',rebackRoomGameRecord);
    that.socket.on('reback_player_game_record', rebackPlayerGameRecord);
    that.socket.on('sync_house_card_count',syncHouseCardCount);
    that.socket.on('sync_players_choose_score',sycnPlayerChooseScore);
    that.socket.on('player_online',playerOnLine);
    that.socket.on('player_offline', playerOffLine);
    that.socket.on('room_end', roomEnd);
    that.socket.on('player_cancel_end_room',playerCancelEndRoom);
    that.socket.on('player_end_room',playerEndRoom);
    that.socket.on('re_enter_room', reEnterRoom);
    that.socket.on('login_result', loginResult);
    that.socket.on('join_room_fail', joinRoomFail);
    that.socket.on('init_data', initData);
    that.socket.on('sync_data', syncData);
    that.socket.on('player_join_room', playerJoinRoom);
    that.socket.on('player_leave', playerLeave);
    that.socket.on('game_start', gameStart);
    that.socket.on('push_cards', pushCards);
    that.socket.on('change_house_manager', changeHouseManager);
    that.socket.on('player_choose_score', playerChooseScore);
    that.socket.on('tip_cow_result', showSelfCowResult);
    that.socket.on('player_show_result', playerShowResult);
    that.socket.on('show_game_result', showGameResult);
    that.socket.on('turn_game_score_result', turnGameScoreResult);
    that.socket.on('player_ready', somePlayerReady);
    that.socket.on('can_choose_cow', canChooseCow);
    that.socket.on('send_game_end_result', gameEndResult);
    // that.socket.on('heart',heart);
    that.socket.on('disconnect', disconnect);

    return that;
};
export default SocketControl;


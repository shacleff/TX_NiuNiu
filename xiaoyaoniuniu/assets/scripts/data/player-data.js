const PlayerData = function () {
    let that = {};
    that.uid = '2345234';
    let auth = '12000001';
    // let auth = '12000001';

    for (let i = 0 ; i < 7 ; i ++){
        auth += Math.floor(Math.random() * 10);
    }
    that.auth = auth;
    that.nickName = '小明' + Math.floor(Math.random() * 10);
    that.avatarUrl = "http://pic2.ooopic.com/12/22/94/30b1OOOPIC5c.jpg";
    that.housecard = 0;
    that.userInfo = {};
    that.init = function (data) {
        console.log('init data = ' + data);
        data = JSON.parse(data);
        console.log('data = ' + JSON.stringify(data));
        // that.uid = data.uid;
        that.auth = data.uid;
        that.nickName = data.nickName;
        that.avatarUrl = data.avatarUrl;
        console.log('nick name = ' + that.nickName);
        // console.log('uid = ' + that.uid);
        console.log('avatarUrl =  ' + that.avatarUrl);
    };



    let cards = [1,2,3,4,7,9];





    return that;
};
export default PlayerData;
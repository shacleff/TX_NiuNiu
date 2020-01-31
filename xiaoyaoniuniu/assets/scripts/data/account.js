import PlayerData from './player-data'
import SRequest from './../utility/simple-request'
import defines from './../defines'
const Account = function () {
    let that = {};
    that.playerData = PlayerData();


    let _callback = function (response, cb) {
        if (response.status !== 'ok') { //非正常回调
            console.error('requestData,Failed!', response.detail);
            if (cb && typeof cb == "function") {    //错误的回调
                cb(response, null);
            }
            return
        }
        if (cb && typeof cb == "function") {    //正常回调
            cb(null, response.res);
        }
    };
    let _request = function (path, queryParam, body, cb) {
        queryParam = queryParam || {};
        if (body) {
            SRequest.post(defines.gameUrl, path, queryParam, body, data=> {
                _callback(data, cb);
            });
        }
        else {
            SRequest.get(defines.gameUrl, path, queryParam, data=> {
                _callback(data, cb);
            })
        }
    };

    that.getPlayerInfo = function (uid, cb) {
        _request('/get_player_info',{uid: uid},null,cb);

    };
    that.login = function (uid, password, cb) {
      _request('/login', {}, {uid: uid, password: password}, function (err, data) {
          if (err){
              console.log('err = ' + err);

          }else {

            cb(data);
          }
      })
    };
    that.createRoom = function (uid,data, cb) {
        _request('/create_room', {uid: uid}, data, cb);
    };
    that.createAccount = function(uid, password, cb){
        _request('/createAccount', {}, {
            uid: uid,
            password: password
        }, cb);
    }
    return that;
};
export default Account;
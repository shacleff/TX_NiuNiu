const Anysdk = function () {
    let that = {};
    console.log('init anysdk');
    that.userPlugin = anysdk.agentManager.getUserPlugin(); //获取玩家插件
    let _callBackMap = {};
    that.loginWX = function (cb) {
        let map = {
            // server_id   : "2",
            // server_url  : "http://xxx.xxx.xxx",
            // key1        : "value1",
            // key2        : "value2"
        };
        that.userPlugin.login(map);
        _callBackMap['login'] = cb;
    };

    const callBack = function (code , msg) {
        console.log('on user result action');
        console.log('code = ' + code);
        console.log('msg = ' + JSON.stringify(msg));
        switch (code){
            case anysdk.UserActionResultCode.kLoginSuccess:
                console.log('登录成功');
                _callBackMap.login({
                    success: true,
                    msg: msg
                });
                break;
            case anysdk.UserActionResultCode.kLoginFail:
                console.log('登录失败');
                _callBackMap.login({
                    success: false,
                    msg: msg
                });
                break;
            case anysdk.UserActionResultCode.kLoginCancel:
                console.log('登录取消');
                _callBackMap.login({
                    success: false,
                    msg: msg
                });
                break;
            default:
                break;
        }
    };
    this.userPlugin.setListener(callBack, this);

    return that;
};
export default Anysdk;
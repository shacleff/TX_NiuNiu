import global from './../global'

cc.Class({
    extends: cc.Component,

    properties: {
        loadingAnimatePre: {
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
        this.loadingAnimate = cc.instantiate(this.loadingAnimatePre);
        this.loadingAnimate.parent = this.node;
        setTimeout(() => {
            this.loadingAnimate.destroy();
        }, 1000);


        // if (cc.sys.isMobile){
        //   this.userPlugin = anysdk.agentManager.getUserPlugin();
        //   this.userPlugin.setListener(this.onUserResult.bind(this), this);
        // }
        // if (cc.sys.isMobile){
        //     global.userPlugin = anysdk.agentManager.getUserPlugin();
        //     // global.userPlugin.setListener(this.onUserResult.bind(this), this);
        //     global.userPlugin.setListener((code, msg)=>{
        //         cc.log('on user result action' + code);
        //         cc.log('msg =' + msg);

        //         switch (code) {
        //             case anysdk.UserActionResultCode.kLoginSuccess:

        //                 let userInfo = global.userPlugin.getUserInfo();
        //                 global.account.playerData.init(userInfo);
        //                 cc.director.loadScene('mainScene');

        //                 break;
        //             case anysdk.UserActionResultCode.kLoginFail:
        //                 cc.log('登陆失败');
        //                 break;
        //             case anysdk.UserActionResultCode.kGetUserInfoSuccess:
        //                 cc.log('获取用户数据成功' + JSON.stringify(msg));
        //                 break;
        //             case anysdk.UserActionResultCode.kGetUserInfoFail:
        //                 cc.log('获取用户数据失败' + JSON.stringify(msg));
        //                 break;
        //             case anysdk.UserActionResultCode.kLogoutSuccess:
        //                 cc.log('登出成功');
        //                 cc.director.loadScene('loginScene');
        //                 break;
        //             default:
        //                 break;

        //         }
        //     }, this);
        // }
    },
    onButtonClick: function (event, customData) {
        if (!global.account.playerData.soundOff){
            cc.audioEngine.play(this.buttonAudioClicp, false, 1);
        }
        switch (customData) {
            case 'wxlogic':
                //微信登录
                cc.log('微信登录');
                cc.director.loadScene('mainScene');
                // global.userPlugin.login();
                break;
            default:
                break;
        }
    },
    onUserResult: function (code, msg) {
        cc.log('on user result action' + code);
        cc.log('msg =' + msg);

        switch (code) {
            case anysdk.UserActionResultCode.kLoginSuccess:

                let userInfo = global.userPlugin.getUserInfo();
                global.account.playerData.init(userInfo);
                cc.director.loadScene('mainScene');

                break;
            case anysdk.UserActionResultCode.kLoginFail:
                cc.log('登陆失败');
                break;
            case anysdk.UserActionResultCode.kGetUserInfoSuccess:
                cc.log('获取用户数据成功' + JSON.stringify(msg));
                break;
            case anysdk.UserActionResultCode.kGetUserInfoFail:
                cc.log('获取用户数据失败' + JSON.stringify(msg));
                break;

        }
    }
});

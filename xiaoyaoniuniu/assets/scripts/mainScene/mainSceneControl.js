import global from './../global'
import SocketControl from './../data/socket-control'

cc.Class({
    extends: cc.Component,

    properties: {
        houseCardCountLabel: {
            default: null,
            type: cc.Label
        },
        nickNameLabel: {
            default: null,
            type: cc.Label
        },
        headImage: {
            default: null,
            type: cc.Node
        },
        uidLabel: {
            default: null,
            type: cc.Label
        },
        gameIntroductionPrefab: {
            default: null,
            type: cc.Prefab
        },
        fightRecordPrefab: {
            default: null,
            type: cc.Prefab
        },
        createRoomPrefab: {
            default: null,
            type: cc.Prefab
        },
        joinRoomPrefab: {
            default: null,
            type: cc.Prefab
        },
        beijiPrefab: {
            default: null,
            type: cc.Prefab
        },
        buttonAudioClicp: {
            url: cc.AudioClip,
            default: null
        },
        setLayerPrefab: {
            default: null,
            type: cc.Prefab
        }
        ,
        richText: cc.Component
    },

    // use this for initialization
    onLoad: function () {
        // this.nickNameLabel.string = '';

        global.event.on('login_success', this.loginSuccess.bind(this));
        global.event.on('enter_room', this.enterRoom.bind(this));
        global.event.on('re_enter_room', this.reEnterRoom.bind(this));
        if (global.socketControl === undefined) {
            global.socketControl = SocketControl();
        } else {
            this.nickNameLabel.string = global.account.playerData.nickName;
            this.uidLabel.string = global.account.playerData.uid;
            this.houseCardCountLabel.string = global.account.playerData.houseCardCount + ''; //玩家房卡的个数
            let remoteUrl = global.account.playerData.avatarUrl;
            // let remoteUrl = "https://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0";
            // cc.loader.load({url: remoteUrl, type: 'png'}, (err, texture) => {
            //     // Use texture to create sprite frame
            //     if (err) {
            //         console.log('err = ' + err);
            //     } else {
            //         let oldWidth = this.headImage.width;
            //         console.log('old width = ' + oldWidth);
            //         this.headImage.getComponent(cc.Sprite).spriteFrame = texture
            //         console.log('now width = ' + this.headImage.width);
            //         // this.headImage.scale = 0.2;
            //     }
            // });
        }

        //测试分享截图 代码

        if (cc.sys.isMobile) {
            var agent = anysdk.agentManager;
            // var share_plugin = agent.getSharePlugin();
            this.sharePlugin = agent.getSharePlugin();
            this.sharePlugin.setListener(this.shareListener.bind(this), this);
        }

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
    reEnterRoom: function () {
        cc.director.loadScene('gameScene');
    },
    loginSuccess: function (data) {
        // console.log('login success' + JSON.stringify(data));
        this.nickNameLabel.string = data.nickName;
        this.uidLabel.string = data.uid;
        this.houseCardCountLabel.string = data.houseCardCount + ''; //玩家房卡的个数
        global.account.playerData.houseCardCount = data.houseCardCount;
        //todo 玩家头像
        let remoteUrl = global.account.playerData.avatarUrl;
        // let remoteUrl = "https://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0";
        cc.loader.load({url: remoteUrl, type: 'png'}, (err, texture) => {
            // Use texture to create sprite frame
            // if (err) {
            //     console.log('err = ' + err);
            // } else {
            //     let oldWidth = this.headImage.width;
            //     console.log('old width = ' + oldWidth);
            //     this.headImage.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            //     console.log('now width = ' + this.headImage.width);
            //     // this.headImage.scale = 0.2;
            // }
        });
    },
    onDestroy: function () {
        global.event.removeAllListeners();
    },
    enterRoom: function () {
        cc.log('enter room');
        cc.director.loadScene('gameScene');
    },
    onButtonClick: function (event, customData) {
        // cc.audioEngine.play('resources/res/sound_m4a/common/win.mp3',false, 1);
        if (!global.account.playerData.soundOff) {
            cc.audioEngine.play(this.buttonAudioClicp, false, 1);
        }
        switch (customData) {
            case 'wanfa':
                //打开玩法界面
                cc.log("打开玩家界面");
                let gameIntroductionNode = cc.instantiate(this.gameIntroductionPrefab);
                gameIntroductionNode.parent = this.node;
                break;
            case 'fightrecord':
                let figheRecord = cc.instantiate(this.fightRecordPrefab);
                figheRecord.parent = this.node;
                break;
            case 'createRoom':
                let createRoom = cc.instantiate(this.createRoomPrefab);
                createRoom.parent = this.node;

                break;
            case 'joinRoom':
                console.log('join room ');
                let joinRoom = cc.instantiate(this.joinRoomPrefab);
                joinRoom.parent = this.node;
                break;
            case 'logout':
                console.log('login out');
                global.userPlugin.logout();
                break;
            case 'set':
                let setLayer = cc.instantiate(this.setLayerPrefab);
                setLayer.parent = this.node;

                break;
            default:
                break
        }
    },
    update: function (dt) {
        this.houseCardCountLabel.string = global.account.playerData.houseCardCount + '';
        // if (global.socketControl) {
        //     // global.socketControl.heart(dt);
        // }

    },
    onDestroy: function () {
        global.event.removeAllListeners(); //删除所有监听
    }

});

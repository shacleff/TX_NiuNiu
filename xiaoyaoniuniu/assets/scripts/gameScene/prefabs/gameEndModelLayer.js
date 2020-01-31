import global from './../../global'
cc.Class({
    extends: cc.Component,

    properties: {
        gameResultCellPrefab: {
            default: null,
            type: cc.Prefab
        },
        cellPosNodeList: {
            default: [],
            type: cc.Node
        },
        buttonAudioClicp: {
            url: cc.AudioClip,
            default: null
        }
    },

    // use this for initialization
    onLoad: function () {
        //根据结果，初始化一下cell
        console.log('初始化数据');
        let playerData = global.account.playerData.gameEndResultData.playerData;
        let houseManagerID = global.account.playerData.gameEndResultData.houseManagerID;
        playerData.sort(function (a, b) {
            if (a.score < b.score){
                return true;
            }
            return false;
        });

        for (let i = 0 ; i < playerData.length ; i ++){
            let data = playerData[i];
            let node = cc.instantiate(this.gameResultCellPrefab);
            node.parent = this.node;
            node.position = this.cellPosNodeList[i].position;
            node.getComponent('gameEndCell').initWithData(i, houseManagerID, data);
        }


        if (cc.sys.isMobile){
            let agent = anysdk.agentManager;
            this.sharePlugin = agent.getSharePlugin();
            this.sharePlugin.setListener((code,msg)=>{
                console.log('share ' + code + ',' + msg);

            }, this);
        }


    },
    onButtonClick: function (event, customData) {
        //按钮
        if (!global.account.playerData.soundOff){
            cc.audioEngine.play(this.buttonAudioClicp, false, 1);
        }
        switch (customData){
            case 'back':
                console.log('返回大厅');
                cc.director.loadScene('mainScene');
                break;
            case 'share':
                console.log('微信分享');
                //截屏并分享

                this.screenShoot((filePath)=>{
                    this.sharePlugin.share({
                        imagePath: filePath,
                        shareTo: 0
                    });
                    //分享图片截屏
                });
                break;
            default:
                break
        }

    },
    screenShoot(func){
        //测试截图代码
        if (CC_JSB) {
            //如果待截图的场景中含有 mask，请开启下面注释的语句
            var renderTexture = cc.RenderTexture.create(1280,720, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
            // var renderTexture = cc.RenderTexture.create(1280, 720);

            //把 renderTexture 添加到场景中去，否则截屏的时候，场景中的元素会移动
            this.node.parent._sgNode.addChild(renderTexture);
            //把 renderTexture 设置为不可见，可以避免截图成功后，移除 renderTexture 造成的闪烁
            renderTexture.setVisible(false);

            //实际截屏的代码
            renderTexture.begin();
            //this.richText.node 是我们要截图的节点，如果要截整个屏幕，可以把 this.richText 换成 Canvas 切点即可
            this.node.parent._sgNode.visit();
            renderTexture.end();
            var fileName = 'share.png';
            renderTexture.saveToFile(fileName, cc.ImageFormat.PNG, true,  ()=> {
                //把 renderTexture 从场景中移除
                renderTexture.removeFromParent();
                cc.log("capture screen successfully!1");

                let imagePath = jsb.fileUtils.getWritablePath() + fileName;
                console.log('image path = ' + imagePath);
                this.sharePlugin.share({
                    shareTo: '0',
                    // title: '小小牛牛',
                    // text: '我在小小牛牛房间号',
                    mediaType: '1',
                    // mediaType: '0',
                    imagePath: imagePath,
                    thumbImage: 'icon.png',

                });
            });
            //打印截图路径
            // cc.log('截图路径' + jsb.fileUtils.getWritablePath());/**/
        }
    },
});

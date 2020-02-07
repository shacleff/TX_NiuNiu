import global from "./global";

cc.Class({
    extends: cc.Component,
    properties: {
       mainNodeLayerPrefab: cc.Prefab,
       gameLayerPrefab: cc.Prefab,
       alertNodePrefab: cc.Prefab
    },
    onLoad () {
        // let node = cc.instantiate(this.mainNodeLayerPrefab);
        // node.parent = this.node;
        this.node.on('enter-game-layer', ()=>{
            console.log("进入游戏层");
            this.enterLayer(this.gameLayerPrefab);
        });
        this.node.on("enter-main-node-layer", ()=>{
            this.enterLayer(this.mainNodeLayerPrefab);
        });
        this.node.on("show-alert", (text)=>{
            let node = cc.instantiate(this.alertNodePrefab);
            node.parent = this.node;
            node.emit("show-text", text);
        });
    },
    enterLayer(prefab){
        let node = cc.instantiate(prefab);
        node.parent = this.node;
        if (this._currentShowLayer){
            node.x = cc.view.getVisibleSize().width;
            this._currentShowLayer.runAction(cc.moveTo(0.5, cc.view.getVisibleSize().width * -1, 0));
            node.runAction(cc.sequence(
                cc.moveTo(0.5, 0,0),
                cc.callFunc(()=>{
                    this._currentShowLayer.destroy();
                    this._currentShowLayer = node;
                })
            ))
        }else{
            this._currentShowLayer = node;
        }
    },
    start () {
        global.controller.setMainNodeController(this.node);
    },
    update (dt) {},
});

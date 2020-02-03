
cc.Class({
    extends: cc.Component,
    properties: {
       mainNodeLayerPrefab: cc.Prefab
    },
    onLoad () {
        let node = cc.instantiate(this.mainNodeLayerPrefab);
        node.parent = this.node;
    },
    start () {

    },
    update (dt) {},
});

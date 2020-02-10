cc.Class({
    extends: cc.Component,

    properties: {
        bgNode: cc.Node,
        numberNodeList: [cc.Node],
        colorNode: cc.Node,
        texturePacker: cc.SpriteAtlas
    },
    onLoad() {
        this.node.on('set-info', (data) => {
            console.log("card set info ", data);
            // number: "3"
            // color: "diamond"
            let number = data.number;
            let color = data.color;
            const ColorConfig = {
                "spade": '3',
                "heart": "2",
                "diamond": "0",
                "club": "1"
            }
            const BlackConfig = {
                "spade": "black",
                "heart": "red",
                "diamond": "red",
                "club": "black"
            }
            if (number !== 0){
                // b-bigtag_0
                let colorStr = "b-bigtag_" + ColorConfig[color];
                console.log("color str", colorStr);
                this.colorNode.getComponent(cc.Sprite).spriteFrame = this.texturePacker.getSpriteFrame(colorStr);
                let numberStr = 'b-' + BlackConfig[color] + '_' + (number - 1);
                console.log("number str = ", numberStr);
                for (let i = 0 ; i < this.numberNodeList.length ; i ++){
                    let node = this.numberNodeList[i];
                    let numberSprite =  node.getComponent(cc.Sprite);
                    numberSprite.spriteFrame = this.texturePacker.getSpriteFrame(numberStr);
                }
            }else{
                this.bgNode.getComponent(cc.Sprite).spriteFrame = this.texturePacker.getSpriteFrame("b-poker_back");
                for (let i = 0 ; i < this.numberNodeList.length ; i ++){
                    let node = this.numberNodeList[i];
                    node.getComponent(cc.Sprite).spriteFrame = undefined;
                }
                this.colorNode.getComponent(cc.Sprite).spriteFrame = undefined;
            }

        });
    },

    start() {

    },

    // update (dt) {},
});

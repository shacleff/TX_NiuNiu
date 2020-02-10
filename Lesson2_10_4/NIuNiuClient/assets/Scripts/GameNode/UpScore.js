import global from "../global";

cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad() {
        let children = this.node.children;
        for (let i = 0; i < children.length; i++) {
            this.addButtonClickEvent(children[i]);

        }
    },
    addButtonClickEvent(node) {
        let button = node.addComponent(cc.Button);
        button.transition = cc.Button.Transition.SCALE;
        node.on("click", () => {
            console.log("node name", node.name);
            let score = node.name.substring(7);
            console.log('score', score);
            global.messageController.sendChooseScoreMessage(score).then(()=>{
                console.log("发送成功");
            });

        })
    },

    start() {

    }

});

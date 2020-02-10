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
        })
    },

    start() {

    }

});

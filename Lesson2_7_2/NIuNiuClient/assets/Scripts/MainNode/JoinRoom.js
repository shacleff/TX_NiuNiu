cc.Class({
    extends: cc.Component,

    properties: {
       
    },


    onLoad () {
        let children = this.node.children;
        for (let i = 0 ; i < children.length ; i ++){
            let node = children[i];
            this.addButtonClickEvent(node);
        }
    },
    addButtonClickEvent(node){
        let button = node.addComponent(cc.Button);
        if (node.name !== 'mainBg6'){
            button.transition = cc.Button.Transition.SCALE;
        }
        node.on("click", ()=>{
            let value = node.name.substring(5);
            console.log("click value", value);
            if (value == "0" || Number(value)){
                console.log("数字")
            }else{
                console.log("非数字")
            }
        })
    },

    start () {

    },

    // update (dt) {},
});

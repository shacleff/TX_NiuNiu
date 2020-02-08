class Controller{
    constructor(){
        this._mainNodeController = undefined;
    }
    setMainNodeController(node){
        this._mainNodeController = node;
        this.enterMainNodeLayer();
    }
    enterGameLayer(){
        console.log("enter game layer")
        this._mainNodeController.emit('enter-game-layer');
    }
    enterMainNodeLayer(){
        this._mainNodeController.emit("enter-main-node-layer");
    }
    showAlert(text){
        this._mainNodeController.emit("show-alert", text);
    }
    // insert into user_info (id, nickname, housecard_count, head_image_url) value(10002,"world", 5,"http://47.105.205.9:3000/images/hall_gg.png" )
}
export default Controller;
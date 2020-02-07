class Controller{
    constructor(){
        this._mainNodeController = undefined;
    }
    setMainNodeController(node){
        this._mainNodeController = node;
        this._mainNodeController.emit("enter-main-node-layer");
    }
    enterGameLayer(){
        console.log("enter game layer")
        this._mainNodeController.emit('enter-game-layer');
    }
    showAlert(text){
        this._mainNodeController.emit("show-alert", text);
    }
}
export default Controller;
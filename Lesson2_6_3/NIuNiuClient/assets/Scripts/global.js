import MessageController from "./Data/MessageController";
import Controller from './Data/Controller'
import PlayerData from "./Data/PlayerData";
const global = {
    messageController : new MessageController(),
    controller: new Controller(),
    playerData: new PlayerData()
}
export default global;
import MessageController from "./Data/MessageController";
import Controller from './Data/Controller'
const global = {
    messageController : new MessageController(),
    controller: new Controller()
}
export default global;
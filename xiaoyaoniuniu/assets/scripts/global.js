import Account from './data/account'
import EventListener from './utility/event-listener'
import Anysdk from './data/anysdk'
const global = {};
global.account = Account();
global.event = EventListener({});
global.configMap = {};
// global.anysdk = (()=>{
//   console.log('初始化 anysdk');
//   if (cc.sys.isMobile){
//     console.log('移动平台');
//     return Anysdk();
//   }else {
//     return undefined;
//   }
// })();
global.tips = function (node, prefab) {
  let tips = cc.instantiate(prefab);
  tips.parent = node;

};
export default  global;
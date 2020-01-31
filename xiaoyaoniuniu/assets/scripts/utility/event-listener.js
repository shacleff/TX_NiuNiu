const EventListener = function (obj) {
  let Register = {};
  obj.on = function (type, method) {
    if (!Register.hasOwnProperty(type)){
      Register[type] = [method];
    }else {
      Register[type].push(method);
    }
  };
  obj.fire = function (type) {
    console.log('fire type = ' + type);
    if (Register.hasOwnProperty(type)){
      console.log('have handler');

      let handlerList = Register[type];
      console.log('事件长度' + handlerList.length);
      for (let i = 0 ; i < handlerList.length ; i ++){
        let handler = handlerList[i];
        let args = [];
        for (let j = 1 ; j < arguments.length ; j ++){
          args.push(arguments[j]);
        }
        // console.log('args = ' + JSON.stringify(args));
        handler.apply(this, args);
      }
    }else {
      console.log('regishter no have '+ type);
    }
  };
  obj.removeListener = function (type, method) {
    if (!Register.hasOwnProperty(type)){
      return;
    }


    let handlerList = Register[type];
    for (let i = 0 ; i < handlerList.length; i++){
      console.log('handler list = ' + handlerList[i]);
      console.log('method = ' + method);
      if (handlerList[i] === method){
        handlerList.splice(i , 1);
        console.log('删掉监听 ' + i);
      }
    }
  };
  obj.removeType = function (type) {
    if (Register.hasOwnProperty(type)){
      Register[type] = [];
    }
  };
  obj.removeAllListeners = function () {
    console.log('删掉所有事件');
    Register = {};
  };
  return obj;
};
export default EventListener;
/**
 * Created by wizard on 16/4/1.
 */

const timeoutLimit = 30 * 1000;

//SRequest.get(defines.gameHomeURL, "s/Info/GetBag", {test: 1, name: "haha"}, data=> {
//  console.log('resp 1' + JSON.stringify(data));
//});
//
//SRequest.post(defines.gameHomeURL, "s/Info/RenamePet", {"pet_id": 1000}, data=> {
//  console.log('resp 2' + JSON.stringify(data));
//})

const SRequest = SRequest || (()=> {
    let that = {};


    that.get = (baseURL, handlerURL, params, cb) => {
      let xhr = new XMLHttpRequest();

      let paramStr = getURLParamsString(params);
      console.log("get string: " + baseURL + handlerURL + paramStr);

      xhr.open("GET", baseURL + handlerURL + paramStr, true);
      xhr.timeout = timeoutLimit;
      xhr.onload = () => {
        let data = JSON.parse(xhr.responseText);
        if (cb) {
          cb.call(this, data);
        }
      };
      xhr.ontimeout = ()=> {
        if (cb) {
          cb.call(this, {timeout: true});
        }
      };
      xhr.send();
    };

    that.post = (baseURL, handlerURL, urlParams, params, cb) => {

      let xhr = new XMLHttpRequest();   // new HttpRequest instance
      console.log('post',baseURL + handlerURL + getURLParamsString(urlParams));
      xhr.open("POST", baseURL + handlerURL + getURLParamsString(urlParams), true);
      xhr.setRequestHeader("Content-Type","application/json");
      xhr.timeout = timeoutLimit;
      xhr.onload = ()=> {
        console.log('xhr.onload',xhr.responseText);
        let data = JSON.parse(xhr.responseText);
        if (cb) {
          cb.call(this, data);
        }
      };
      xhr.ontimeout = ()=> {
        if (cb) {
          cb.call(this, {timeout: true});
        }
      };
      console.log('xhr.onload',params);
      const bodyContent = params ? JSON.stringify(params) : "";
      console.log('body content = ' + JSON.stringify(bodyContent));
      xhr.onerror = function (e) {
        console.log('server error ' + e);
        if (cb){
          cb.call(this,{timeout: true});
        }
      };
      xhr.send(bodyContent);
    };

    that.jump = (url, params)=> {
      let paramStr = getURLParamsString(params);
      console.log("jump to url: " + url + paramStr);
      window.location.href = url + paramStr;
    };

    const getURLParamsString = (params, isStart) => {
      let paramStr = "";
      if (params) {
        let start = (isStart != undefined) ? isStart : true;
        for (let index in params) {
          if (start) {
            start = false;
            paramStr += "?";
          }
          else {
            paramStr += "&";
          }
          paramStr += index + "=" + params[index];
        }
      }

      return paramStr;
    };

    return that;
  })();

export default SRequest;
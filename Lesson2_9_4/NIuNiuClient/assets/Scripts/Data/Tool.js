class Tool {
    constructor(){

    }
    static getQueryVariable(variable){
        let str = window.location.search.substring(1);
        console.log('str = ', str);
        let list = str.split("&");
        for (let i = 0 ; i < list.length ; i ++){
            let value = list[i].split("=");
            if (value[0] == variable){
                return value[1];
            }
            
        }
        return false;
    }
}
export default Tool;
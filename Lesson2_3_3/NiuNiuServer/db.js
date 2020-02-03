const MySql = require('mysql');
class DB{
    constructor(){
        let mysql = MySql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'chu7758521',
            database: 'niuniu'
        });
        mysql.connect();
        console.log("链接数据库");
        this._mysql = mysql;
    }
    getUserInfo(id){
        return new Promise((resole, reject)=>{
            this._mysql.query('select * from user_info where id = ' + id, (err, result)=>{
                if (err){
                    reject(err);
                    console.log("err", err);
                }else{
                    console.log("get user info = ", JSON.stringify(result));
                    resole(result);
                }
            });
        });
    }
}
module.exports = DB;
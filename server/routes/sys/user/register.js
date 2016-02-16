/**
 * Created by junpinp on 2015/12/27.
 * 用户注册
 */
'use strict';
var Logger = APP.Library.Logger.getLogger(__filename);

module.exports = {
    Method: APP.Method.Post,
    Main: function(data, callback){

        var account = APP.Entity.Account.create();
        account.register(data.name, data.pwd, function(error, result){
            if(error){
                return callback(error);
            }
            Logger.debug(result);

            callback(null, new APP.ReturnMessage(null, account.id));
        });
    }
}
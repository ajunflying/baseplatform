/**
 * Created by junpinp on 2016/1/1.
 */
'use strict';

var Logger = APP.Library.Logger.getLogger(__filename);


module.exports = {
    Method: APP.Method.Post,
    Main: function (data, callback) {
        var menu = APP.Entity.Menu.create();
        menu.get(function(error, result){
            if(error){
                return callback(error);
            }
            var msg = new APP.ReturnMessage(null, result);
            callback(null, msg);
        });
    }
};
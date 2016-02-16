/**
 * Created by junpinp on 2015/12/29.
 * 注册appserver
 */
'use strict';

var Logger = APP.Library.Logger.getLogger(__filename);

module.exports = {
    Method: APP.Method.Post,
    Main: function (data, callback) {


        var appserver = APP.Entity.Appserver.create();
        appserver.register(data.serverName, data.serverHost, function (error, result) {
            if (error) {
                return callback(error);
            }
            Logger.debug(result);

            callback(null, new APP.ReturnMessage(null, result));
        });

    }
};
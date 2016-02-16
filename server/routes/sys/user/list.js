/**
 * Created by junpinp on 2015/12/25.
 */
'use strict';
var async = require('async');

module.exports = {
    Method: APP.Method.Post,
    Main: function (data, callback) {
        var account = APP.Entity.Account.create();
        account.list(data, function (error, result) {
            if (error) {
                return callback(error);
            }
            var msg = new APP.ReturnMessage(null, result);
            callback(null, msg);
        });
    }
}
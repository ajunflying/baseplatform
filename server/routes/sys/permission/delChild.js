/**
 * Created by junpinp on 2016/1/24.
 */
'use strict';
var async = require('async');
var Logger = APP.Library.Logger.getLogger(__filename);

module.exports = {
    Method: APP.Method.Post,
    Main: function (data, callback) {
        var checker = new APP.InputChecker(data);
        checker.requireString('id');
        if (checker.error) {
            return callback(new APP.ServerError(checker.error, __filename));
        }
        var permission = APP.Entity.Permission.create(data.id);

        async.series([
            function (cb) {
                permission.delete(cb)
            }
        ], function (error, result) {
            if (error) {
                return callback(error);
            }
            var msg = new APP.ReturnMessage(null, 'success');
            callback(null, msg);
        });

    }
}
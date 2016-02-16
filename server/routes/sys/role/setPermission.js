/**
 * Created by junpinp on 2016/1/29.
 */
'use strict';
var async = require('async');
var Logger = APP.Library.Logger.getLogger(__filename);

module.exports = {
    Method: APP.Method.Post,
    Main: function (data, callback) {
        var checker = new APP.InputChecker(data);
        checker.requireString('roleId');
        //checker.requireJsonObject('permission');

        if (checker.error) {
            return callback(new APP.ServerError(checker.error, __filename));
        }
        var torolePermission = APP.Entity.TorolePermission.create();

        async.series([
            function (cb) {
                torolePermission.toSave(data.roleId, data.permission, cb);
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
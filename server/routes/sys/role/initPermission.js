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
        if (checker.error) {
            return callback(new APP.ServerError(checker.error, __filename));
        }

        var returnObj = {};
        async.parallel([
            function(cb){
                var permission = APP.Entity.Permission.create();
                permission.getAll(function (err, reply) {
                    if (err) {
                        return cb(err);
                    }
                    returnObj.all = reply;
                    cb();
                });
            },
            function(cb){
                var torolePermission = APP.Entity.TorolePermission.create();
                torolePermission.getInfoByRoleId(data.roleId, function(err, reply){
                    if(err){
                        return cb(err);
                    }
                    returnObj.choose = reply;
                    cb();
                });
            }
        ], function(error, result){
            if(error){
                return callback(error);
            }
            var msg = new APP.ReturnMessage(null, returnObj);
            callback(null, msg);
        });
    }
}
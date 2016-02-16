/**
 * Created by junpinp on 2016/1/25.
 */
'use strict';
var async = require('async');
var Logger = APP.Library.Logger.getLogger(__filename);

module.exports = {
    Method: APP.Method.Post,
    Main: function (data, callback) {
        var checker = new APP.InputChecker(data);
        checker.requireString('id');
        checker.requireString('pid');
        checker.requireString('name');
        checker.requireString('desc');

        if (checker.error) {
            return callback(new APP.ServerError(checker.error, __filename));
        }
        var permission = APP.Entity.Permission.create(data.id);

        async.series([
            function (cb) {
                permission.load(cb);
            },
            function(cb){
                /*判断是否有相同的*/
                permission.judgeChildName(data.pid, data.name, function (err, reply) {
                    if (err) {
                        return cb(err);
                    }
                    if (reply) {
                        return cb(new APP.ServerError(APP.ErrorMsg.PERMISSION_CHILD_EXIST_ALIKE))
                    }
                    cb();
                });
            },
            function (cb) {
                permission.childName = data.name;
                permission.nameDesc = data.desc;
                permission.save(cb);
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
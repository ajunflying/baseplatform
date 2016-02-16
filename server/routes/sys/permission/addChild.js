/**
 * Created by junpinp on 2016/1/21.
 */
'use strict';
var async = require('async');
var Logger = APP.Library.Logger.getLogger(__filename);

module.exports = {
    Method: APP.Method.Post,
    Main: function (data, callback) {
        var checker = new APP.InputChecker(data);
        checker.requireString('id');
        checker.requireString('name');
        checker.requireString('desc');
        if (checker.error) {
            return callback(new APP.ServerError(checker.error, __filename));
        }
        var permission = APP.Entity.Permission.create();

        async.series([
            function (cb) {
                /*判断父节点是否正确*/
                var p2 = APP.Entity.Permission.create(data.id);
                p2.load(function (err, reply) {
                    if (err) {
                        return cb(err);
                    }
                    if (p2.parentId) {
                        return cb(new APP.ServerError(APP.ErrorMsg.PERMISSION_MODULE_IS_NOT_BOOT));
                    }
                    cb();
                });
            },
            function (cb) {
                /*判断是否有相同的*/
                permission.judgeChildName(data.id, data.name, function (err, reply) {
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
                permission.id = APP.Library.Tool.uuV4();
                permission.parentId = data.id;
                permission.childName = data.name;
                permission.nameDesc = data.desc;
                permission.insert(cb);
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
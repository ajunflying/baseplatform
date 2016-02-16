/**
 * Created by junpinp on 2016/1/26.
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
        var torole = APP.Entity.Torole.create(data.id);

        async.series([
            function (cb) {
                torole.load(cb);
            },
            function (cb) {
                /*判断是否存在*/
                torole.judgeName(data.name, function (err, reply) {
                    if (err) {
                        return cb(err);
                    }
                    if (reply) {
                        return cb(new APP.ServerError(APP.ErrorMsg.ROLE_EXIST_ALIKE_NAME))
                    }
                    cb();
                });
            },
            function (cb) {
                /*保存*/
                torole.name = data.name;
                torole.desc = data.desc;
                torole.save(cb);
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
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
        checker.requireString('name');
        checker.requireString('desc');
        if (checker.error) {
            return callback(new APP.ServerError(checker.error, __filename));
        }
        var torole = APP.Entity.Torole.create();

        async.series([
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
                torole.id = APP.Library.Tool.uuV4();
                torole.name = data.name;
                torole.desc = data.desc;
                torole.visible = 1;
                torole.operator = '';
                torole.insert(cb);
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
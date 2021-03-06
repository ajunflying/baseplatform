/**
 * Created by junpinp on 2016/1/17.
 */
'use strict';
var async = require('async');
var Logger = APP.Library.Logger.getLogger(__filename);

module.exports = {
    Method: APP.Method.Post,
    Main: function (data, callback) {
        var checker = new APP.InputChecker(data);
        checker.requireInt('id');
        checker.requireBoolean('state');
        if (checker.error) {
            return callback(new APP.ServerError(checker.error, __filename));
        }

        var menu = APP.Entity.Menu.create(data.id);

        async.series([
            function (cb) {
                menu.load(cb);
            },
            function (cb) {
                menu.state = data.state ? 1 : -1;
                menu.save(cb);
            }
        ], function (error, result) {
            if (error) {
                return callback(error);
            }
            var msg = new APP.ReturnMessage(null, 'success');
            callback(null, msg);
        });
    }
};
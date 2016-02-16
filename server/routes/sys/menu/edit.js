/**
 * Created by junpinp on 2016/1/9.
 */
'use strict';
var async = require('async');
var Logger = APP.Library.Logger.getLogger(__filename);

module.exports = {
    Method: APP.Method.Post,
    Main: function (data, callback) {
        var checker = new APP.InputChecker(data);
        checker.requireInt('id');
        checker.requireString('name');
        checker.optionalInt('parentId');
        checker.optionalString('host');
        checker.optionalString('url');
        checker.optionalInt('order');
        checker.optionalString('icon');

        if (checker.error) {
            return callback(new APP.ServerError(checker.error, __filename));
        }

        var menu = APP.Entity.Menu.create(data.id);
        async.series([
            function (cb) {
                menu.load(cb);
            },
            function (cb) {
                menu.name = data.name;
                menu.parentId = data.parentId;
                menu.host = data.host;
                menu.url = data.url;
                menu.order = data.order;
                menu.icon = data.icon;
                menu.level = data.level;
                menu.save(cb);
            }
        ], function (error, result) {
            if (error) {
                return callback(error);
            }
            callback(null, new APP.ReturnMessage(null, 'success'));
        });
    }
}
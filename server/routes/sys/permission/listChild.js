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

        if (checker.error) {
            return callback(new APP.ServerError(checker.error, __filename));
        }

        var permission = APP.Entity.Permission.create();

        permission.listChild(data, function (error, result) {
            if (error) {
                return callback(error);
            }
            var list = [];
            result.forEach(function (item) {
                list.push({
                    id: item.id,
                    pid: item.parentId,
                    childName: item.childName,
                    nameDesc: item.nameDesc
                });
            });
            var msg = new APP.ReturnMessage(null, list);
            callback(null, msg);
        });

    }
}
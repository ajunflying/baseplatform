/**
 * Created by junpinp on 2016/1/20.
 */
'use strict';
var async = require('async');
var Logger = APP.Library.Logger.getLogger(__filename);

module.exports = {
    Method: APP.Method.Post,
    Main: function (data, callback) {

        var permission = APP.Entity.Permission.create();

        permission.list(data, function (error, result) {
            if (error) {
                return callback(error);
            }
            var list = [];
            result.list.forEach(function (item) {
                list.push({
                    id: item.id,
                    name: item.moduleName,
                    nameDesc: item.nameDesc,
                    createdAt: APP.Library.Tool.formatDateTime(item.createdAt)
                });
            });
            var msg = new APP.ReturnMessage(null, {
                list: list,
                count: result.count
            });
            callback(null, msg);
        });

    }
}
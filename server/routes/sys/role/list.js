/**
 * Created by junpinp on 2016/1/25.
 */
'use strict';
var async = require('async');
var Logger = APP.Library.Logger.getLogger(__filename);

module.exports = {
    Method: APP.Method.Post,
    Main: function (data, callback) {

        var torole = APP.Entity.Torole.create();

        torole.list(data, function (error, result) {
            if (error) {
                return callback(error);
            }
            var list = [];
            result.list.forEach(function (item) {
                list.push({
                    id: item.id,
                    name: item.name,
                    desc: item.desc,
                    visible: item.visible,
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
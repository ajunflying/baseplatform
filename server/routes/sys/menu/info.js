/**
 * Created by junpinp on 2016/1/7.
 */
'use strict';

var Logger = APP.Library.Logger.getLogger(__filename);

module.exports = {
    Method: APP.Method.Post,
    Main: function (data, callback) {
        var checker = new APP.InputChecker(data);
        checker.requireInt('id');
        if (checker.error) {
            return callback(new APP.ServerError(checker.error, __filename));
        }

        var menu = APP.Entity.Menu.create(data.id);
        menu.load(function (error, result) {
            if (error) {
                return callback(error);
            }
            var obj = {
                parentId: menu.parentId,
                menuName: menu.name,
                host: menu.host,
                url: menu.url,
                icon: menu.icon,
                order: menu.order,
                level: menu.level
            };
            var msg = new APP.ReturnMessage(null, obj);
            callback(null, msg);
        });
    }
};
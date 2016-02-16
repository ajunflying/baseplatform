/**
 * Created by junpinp on 2016/1/12.
 */

'use strict';
var async = require('async');
var Logger = APP.Library.Logger.getLogger(__filename);

module.exports = {
    Method: APP.Method.Post,
    Main: function (data, callback) {
        var checker = new APP.InputChecker(data);
        checker.requireInt('id');
        checker.requireString('type');//up, down

        var menu = APP.Entity.Menu.create(data.id);
        var perMenu;
        async.series([
            function (cb) {
                menu.load(cb);
            },
            function (cb) {
                menu.getMenuByParentId(menu.parentId, function (err, reply) {
                    if (err) {
                        return cb(err);
                    }
                    reply.forEach(function (item, i) {
                        if (item.id === data.id) {
                            if (data.type === 'up' && reply[i - 1]) {
                                /*向上移动*/
                                perMenu = reply[i - 1];
                            }
                            if (data.type === 'down' && reply[i + 1]) {
                                /*乡下移动*/
                                perMenu = reply[i + 1];
                            }
                        }
                    });
                    if (!perMenu) {
                        return cb(new APP.ServerError(APP.ErrorMsg.NORMAL_ERROR, null, '不能移动菜单'));
                    }
                    cb();
                });
            },
            function (cb) {
                var temp = menu.order;
                menu.order = perMenu.order;
                perMenu.order = temp;
                cb();
            },
            function (cb) {
                menu.save(cb);
                async.parallel([
                    function (cbk) {
                        menu.save(cbk);
                    },
                    function (cbk) {
                        var menu2 = APP.Entity.Menu.create(perMenu);
                        menu2.save(cbk);
                    }
                ], cb);
            }
        ], function (error, result) {
            if (error) {
                return callback(error);
            }
            callback(null, new APP.ReturnMessage(null, 'success'));
        });
    }
};
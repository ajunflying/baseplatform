/**
 * Created by junpinp on 2016/1/1.
 */
'use strict';
var async = require('async');
var Logger = APP.Library.Logger.getLogger(__filename);

module.exports = {
    Method: APP.Method.Post,
    Main: function (data, callback) {

        var menu = APP.Entity.Menu.create();
        menu.parentId = data.parentId;
        menu.order = data.order;
        menu.name = data.name;
        menu.host = data.host || '';
        menu.url = data.url || '';

        if (!menu.url) {
            menu.icon = ''
        } else {
            menu.icon = data.icon || 'icon-docs';
        }
        async.series([
            function (cb) {
                if (menu.parentId === 0) {
                    menu.level = 0;
                    return cb();
                }
                var parentMenu = APP.Entity.Menu.create(menu.parentId);
                parentMenu.load(function (err, reply) {
                    if (err) {
                        return cb(err);
                    }
                    //if(reply.state != APP.Entity.Menu.State.Enabled){
                    //    return cb();
                    //}
                    menu.level = parentMenu.level + 1;
                    cb();
                });
            },
            function (cb) {
                menu.add(function (err, reply) {
                    if (err) {
                        return cb(err);
                    }
                    cb();
                });
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
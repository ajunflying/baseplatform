/**
 * Created by junpinp on 2016/1/20.
 */
'use strict';

module.exports = {
    Method: APP.Method.Get,
    Main: function (data, callback) {
        var msg = new APP.ReturnMessage();
        msg.url = 'sys/permission/listModule';
        callback(null, msg);
    }
}
/**
 * Created by junpinp on 2016/1/3.
 */
'use strict';

module.exports = {
    Method: APP.Method.Get,
    Main: function (data, callback) {
        var msg = new APP.ReturnMessage();
        msg.url = 'sys/menu/list';
        callback(null, msg);
    }
}
/**
 * Created by junpinp on 2016/1/25.
 */
'use strict';

module.exports = {
    Method: APP.Method.Get,
    Main: function (data, callback) {
        var msg = new APP.ReturnMessage();
        msg.url = 'sys/role/list';
        callback(null, msg);
    }
}
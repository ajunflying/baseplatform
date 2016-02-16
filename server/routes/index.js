/**
 * Created by junpinp on 2015/12/22.
 */
'use strict';

module.exports = {
    Method: APP.Method.Get,
    Main: function (data, callback) {
        var msg = new APP.ReturnMessage();
        msg.url = 'index';
        callback(null, msg);
    }
}
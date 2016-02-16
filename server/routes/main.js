/**
 * Created by junpinp on 2015/12/30.
 */
'use strict';

module.exports = {
    Method: APP.Method.Get,
    Main: function (data, callback) {
        var msg = new APP.ReturnMessage();
        msg.url = 'main';
        callback(null, msg);
    }
}
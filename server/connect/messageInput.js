/**
 * Created by junpinp on 2015/12/23.
 */
'use strict';

module.exports = function (req, res) {
    req.setEncoding("utf8");
    var data, method;

    if (req.method === "GET") {
        data = req.query;
        method = APP.Method.Get;
    } else if (req.method === "POST") {
        data = req.body;
        method = APP.Method.Post;
    } else {
        Logger.error('not support ' + req.method);
        res.render('error');
        return;
    }

    req.method__ = method;
    req.data__ = data;
};
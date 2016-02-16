'use strict';

var Logger = APP.Library.Logger.getLogger(__filename);
var MessageInput = require('./messageInput.js');
var Write = require('./write.js');

module.exports = function (req, res) {
    req.__time__ = new Date();

    MessageInput(req, res);//采集请求参数

    Logger.debug('request ', req.url , APP.Library.Tool.logInspect(req.data__, true), req.url);

    if (!APP.Routes.hasOwnProperty(req.method__)) {
        Logger.error('路由不存在' + req.method__);
        return;
    }

    var url = req.url;
    if (!APP.Routes[req.method__].hasOwnProperty(url)) {
        Logger.error('路由不存在' + url);
        return;
    }

    APP.Routes[req.method__][url](req.data__, function (error, reply) {
        Write[req.method__](req, res, error, reply);
    });

};



/**
 * Created by junpinp on 2015/12/23.
 */
'use strict';

var Logger = APP.Library.Logger.getLogger(__filename);

module.exports = {
    Get: function (req, res, error, result) {
        result = result || {};
        if (error) {
            res.redirect('/error');
        } else {
            var _obj = new buildMessage(error, result.data);

            Logger.debug("response ",
                req.url,
                APP.Library.Tool.logInspect(_obj, true),
                ((new Date()) - req.__time__) + 'ms');

            if (result.url) {
                res.render(result.url, _obj);
            } else {
                res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
                res.write(JSON.stringify(_obj));
                res.end();
            }
        }
    },
    Post: function (req, res, error, result) {
        result = result || {};
        res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});

        var _obj = new buildMessage(error, result.data);

        Logger.debug("response ",
            req.route.path, APP.Library.Tool.logInspect(_obj, true),
            ((new Date()) - req.__time__) + 'ms');

        res.write(JSON.stringify(_obj));
        res.end();
    }
}


function buildMessage(error, data) {
    var _obj = {
        status: 0
    };
    if (error) {
        Logger.error(error);
        if (error.hasOwnProperty('innerError')) {
            Logger.error(error.innerError.stack || error.innerError);
        }
        _obj.status = error.code || 2;
        _obj.message = error.message || 'unknown server error';
    } else {
        if (data)
            _obj.body = data;
    }
    return _obj;
}
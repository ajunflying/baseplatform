/**
 * Created by junpinp on 2015/12/22.
 */
'use strict';

var fs = require('fs');
var PATH = require('path');
var removePath = [''];

var handle = require('./connect/handle.js');

var base_dirname;
module.exports = function (app) {

    var basepath = PATH.join(process.cwd(), "/server/routes/");

    base_dirname = PATH.basename(basepath);

    read(basepath, APP.Routes);

    for (var key in APP.Routes) {
        for (var path in APP.Routes[key]) {
            app[key.toLocaleLowerCase()](path, handle);
        }
    }

};

function read(path, obj) {
    if (!fs.existsSync(path)) {
        return "";
    }
    var list = fs.readdirSync(path);
    list.forEach(function (file) {
        var stat = fs.statSync(PATH.join(path, file));
        if (stat.isDirectory()) {
            read(PATH.join(path, file), obj);
        } else {
            if (/.js$/.test(file) && removePath.indexOf(file) == -1) {
                var _url = PATH.join(path, file);
                var _obj = require(_url);

                var _path = _url.substring(_url.indexOf("routes") + base_dirname.length, _url.length - 3).replace(/\\/g, '\/');

                if (_obj.hasOwnProperty('Method')) {
                    obj[_obj['Method']] = obj[_obj['Method']] || {};
                    obj[_obj['Method']][_path] = _obj.Main;
                } else {
                    if (!obj.hasOwnProperty('GET')) {
                        obj['GET'] = {};
                    }
                    obj[_obj['Method']][_path] = _obj.Main;
                }
            }
        }
    });
}

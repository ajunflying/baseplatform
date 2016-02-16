'use strict';

var path = require('path');
var fs = require("fs");

function loadPath(dirPath) {
    var result = {};
    var key = toUpperFirst(path.basename(dirPath));
    result[key] = {};

    readDir(dirPath, result[key]);

    return result;
};

function readDir(dirPath, parent, key) {
    if (!fs.existsSync(dirPath)) {
        return "";
    }
    var point = parent;
    if (key) {
        parent[key] = {};
    }
    var list = fs.readdirSync(dirPath);
    list.forEach(function (file) {
        if (true) {
            var stat = fs.statSync(path.join(dirPath, file));
            if (stat.isDirectory()) {
                var _key = toUpperFirst(file);
                if (key) {
                    readDir(path.join(dirPath, file), point[key], _key);
                } else {
                    readDir(path.join(dirPath, file), point, _key);
                }
            } else if (stat.isFile()) {
                if (/.js$/.test(file) || /.json$/.test(file)) {
                    var _name = file.split('.');
                    _name = toUpperFirst(_name[0]);
                    if (key) {
                        point[key][_name] = require(path.join(dirPath, file));
                    } else {
                        point[_name] = require(path.join(dirPath, file));
                    }
                }
            }
        }
    });
};

function toUpperFirst(value) {
    return value.substring(0, 1).toUpperCase() + value.substring(1);
}

function objToParent(parent, obj) {
    var key = Object.keys(obj);
    if (!parent.hasOwnProperty(key)) {
        parent[key] = obj[key];
    }
};

function merge(obj1, obj2) {
    obj1 = obj1 ? obj1 : {};
    obj2 = obj2 ? obj2 : {};

    for (var k2 in obj2) {
        if (Object.keys(obj1).length > 0) {
            for (var k1 in obj1) {
                if (k1 === k2) {
                    obj1['_' + k2] = obj2[k2];
                    console.error('有重复的文件名，这个两个%s %s', k1, k2);
                } else {
                    obj1[k2] = obj2[k2];
                }
            }
        } else {
            obj1[k2] = obj2[k2];
        }
    }
};


exports.readDir = readDir;
exports.merge = merge;
exports.loadPath = loadPath;
exports.objToParent = objToParent;

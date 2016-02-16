/**
 * @tools公共方法工具
 */
'use strict';

var util = require('util');
var crypto = require('crypto');
var uuid = require('node-uuid');
var moment = require('moment');

var Tool = module.exports = {};

/*
 * info:获取value在数组中的index
 * */
Tool.getArrayValueIndex = function (obj, value) {
    var self = this;
    if (self.isArray(obj) && obj.length > 0) {
        for (var i = 0; i < obj.length; i++) {
            if (obj[i] === value) {
                return i;
                break;
            }
        }
    } else {
        return null;
    }
};


/*
 * info:hash转成obj对象
 * [key,value,key,value,key,value,key,value]
 * */
Tool.arrayToObj = function (arry) {
    var obj = {};
    if (arry instanceof Array) {
        for (var i = 0; i < arry.length; i = i + 2) {
            obj[arry[i]] = arry[i + 1] || "";
        }
        return obj;
    }
    return null;
};
/*
 * info:在min和max中生成一个随机数，包含max和min
 * */
Tool.random = function (max, min) {
    return new Number(Math.random() * (max - min) + min).toFixed(0);
};
/*
 * info:生成V4随机数guid
 * */
Tool.uuV4 = function () {
    return uuid.v4().replace(/-/g, "");
};

/*
 * info:md5加密
 * */
Tool.md5 = function (str) {
    str = (new Buffer(str)).toString("binary");
    return crypto.createHash('md5').update(str).digest("hex");
};

/*
 * info:深复制
 * */
Tool.deepCopy = function (object) {
    var self = this;
    var _obj = object instanceof Array ? [] : {};
    for (var k in object) {
        if (object.hasOwnProperty(k)) {
            if (typeof(object[k]) === "object") {
                _obj[k] = typeof(object[k]) === "object" ? self.deepCopy(object[k]) : object[k];
            } else {
                _obj[k] = object[k];
            }
        }
    }
    return _obj;
};
/*
 * @随机生成字符串
 * */
Tool.randString = function (len) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqretuvwxyz0123456789";
    var ret = '';
    for (var i = 0; i < len; i++) {
        var rand = Math.floor(Math.random() * 64);
        ret += chars [rand];
    }
    return ret;
};

/*
 * @打印对象
 * */
Tool.logInspect = function (obj, flag) {
    if (flag) {
        return util.inspect(obj, true, null, true);
    } else {
        return obj;
    }
};

/*是int类型*/
Tool.isInt = function (value) {
    return typeof value === 'number' && value % 1 === 0
};

/*是Number类型*/
Tool.isNumber = function (value) {
    return typeof value === 'number';
};

/*是string类型*/
Tool.isString = function (value, len) {
    var flag = false;
    if (typeof value === 'string') {
        flag = true;
    }
    if (flag && len && value.length < len) {
        flag = false;
    }
    return flag;
};

Tool.isBoolean = function (value) {
    return typeof value === 'boolean';
};


Tool.formatDateTime = function (value) {
    if (typeof value === 'number') {
        value = value * 1000;
    }
    return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '';
};

Tool.formatDate = function (value) {
    if (typeof value === 'number') {
        value = value * 1000;
    }
    return value ? moment(value).format('YYYY-MM-DD') : '';
};

Tool.startOfMonth = function (value) {
    if (typeof value === 'number') {
        value = value * 1000;
    }
    return value ? moment(value).startOf('month').toDate() : null;
};

Tool.endOfMonth = function (value) {
    if (typeof value === 'number') {
        value = value * 1000;
    }
    return value ? moment(value).endOf('month').toDate() : null;
};

Tool.startOfDay = function (value) {
    if (typeof value === 'number') {
        value = value * 1000;
    }
    return value ? moment(value).startOf('day').toDate() : null;
};

Tool.endOfDay = function (value) {
    if (typeof value === 'number') {
        value = value * 1000;
    }
    return value ? moment(value).endOf('day').toDate() : null;
};

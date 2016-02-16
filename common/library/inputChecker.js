'use strict';

var lodash = require('lodash');

module.exports = InputChecker;

function InputChecker(data) {
    if (!data) {
        return;
    }
    this.error = null;
    this.data = data;
}
/*错误返回*/
InputChecker.prototype.returnError = function (key, value, info) {
    var self = this;
    self.error = {
        message: "参数错误：[" + key + "]" + (info || ""),
        code: 1003
    };
};

/*必选参数，必须是一个ObjectId 24位的字符串*/
InputChecker.prototype.requireObjectId = function (key) {
    var self = this;
    if (!self.data.hasOwnProperty(key)) {
        return self.returnError(key, self.data[key], "必选择参数，必须是一个ObjectId，且不可为空");
    }
    var flag = function (value) {
        var reg = /^[0-9a-z]{24}$/i;
        return value && typeof(value) === "string" && reg.test(value);
    };
    if (!flag(self.data[key])) {
        return self.returnError(key, self.data[key], "必选择参数，必须是一个ObjectId，且不可为空");
    }
    return self.data[key];
};

/*必选字符串参数*/
InputChecker.prototype.requireString = function (key) {
    var self = this;
    if (!self.data.hasOwnProperty(key)) {
        return self.returnError(key, self.data[key], "必选参数，必须是一个String，且不可为空");
    }
    var flag = function (value) {
        return lodash.isString(value) && value != '' && value != null && value != undefined;
    };
    if (!flag(self.data[key])) {
        return self.returnError(key, self.data[key], "必选参数，必须是一个String，且不可为空");
    }
    return self.data[key];
};
/*可选字符串参数*/
InputChecker.prototype.optionalString = function (key, dv) {
    var self = this;
    var flag = function (value) {
        return lodash.isString(value);
    };

    if (self.data.hasOwnProperty(key) && !flag(self.data[key])) {
        return self.returnError(key, self.data[key], "可选参数，String，可为空");
    }
    if (flag(dv)) {
        self.data[key] = dv;
    }
    return self.data[key];
};

/*必选数值参数*/
InputChecker.prototype.requireNumber = function (key) {
    var self = this;
    if (!self.data.hasOwnProperty(key)) {
        return self.returnError(key, self.data[key], "必选参数，必须是一个Number");
    }
    var flag = function (value) {
        return lodash.isNumber(value);
    };
    if (!flag(self.data[key])) {
        return self.returnError(key, self.data[key], "必选参数，必须是一个Number");
    }
    self.data[key] = Number(self.data[key]);
    return self.data[key];
};
/*可选数值参数*/
InputChecker.prototype.optionalNumber = function (key, dv) {
    var self = this;
    var flag = function (value) {
        return lodash.isNumber(value);
    };
    if (self.data.hasOwnProperty(key) && !flag(self.data[key])) {
        return self.returnError(key, self.data[key], "可选参数，Number");
    }
    if (flag(dv)) {
        self.data[key] = dv;
    }
    return self.data[key];
};

/*必选整数参数*/
InputChecker.prototype.requireInt = function (key) {
    var self = this;
    if (!self.data.hasOwnProperty(key)) {
        return self.returnError(key, self.data[key], "必选参数，必须是一个Int");
    }
    var flag = function (value) {
        var _val = parseInt(value);
        if(!lodash.isNumber(value) || _val.toString() != _val){
            return false;
        }
        return true;
    };
    if (!flag(self.data[key])) {
        return self.returnError(key, self.data[key], "必选参数，必须是一个Int");
    }
    return self.data[key];
};
/*可选整数参数*/
InputChecker.prototype.optionalInt = function (key, dv) {
    var self = this;
    var flag = function (value) {
        var _val = parseInt(value);
        if(!lodash.isNumber(value) || _val.toString() != _val){
            return false;
        }
        return true;
    };
    if (self.data.hasOwnProperty(key) && !flag(self.data[key])) {
        return self.returnError(key, self.data[key], "可选参数，Int");
    }
    if (flag(dv)) {
        self.data[key] = dv;
    }
    return self.data[key];
};

/*必选的数组*/
InputChecker.prototype.requireArray = function (key) {
    var self = this;
    if (!self.data.hasOwnProperty(key)) {
        return self.returnError(key, "", "必选参数，必须是一个Array");
    }
    if (!lodash.isArray(self.data[key])) {
        return self.returnError(key, self.data[key], "必选参数，必须是一个Array");
    }
    return self.data[key];
};

/*必选的对象，主要是JSON判断*/
InputChecker.prototype.requireJsonObject = function (key) {
    var self = this;
    if (!self.data.hasOwnProperty(key)) {
        return self.returnError(key, "", "必选参数，必须是一个JSON");
    }
    try {
        var _value = JSON.parse(self.data[key]);
        if (self.data[key].constructor != Object) {
            return self.returnError(key, JSON.stringify(self.data[key]), "必选参数，必须是一个JSON");
        }
        self.data[key] = _value;
    } catch (e) {
        return self.returnError(key, JSON.stringify(self.data[key]), "必选参数，必须是一个JSON");
    }
    return self.data[key];
};

/*必选日期*/
InputChecker.prototype.requireDate = function (key) {
    var self = this;
    if (!self.data.hasOwnProperty(key)) {
        return self.returnError(key, "", "必选参数，必须是一个Date");
    }
    if (!isNaN(self.data[key])) {
        self.data[key] = parseInt(self.data[key]);
    }
    var time = new Date(self.data[key]);
    if (time == "Invalid Date") {
        return self.returnError(key, self.data[key], "必选参数，必须是一个Date");
    }
    self.data[key] = time;
    return self.data[key];
};

/*必选bool*/
InputChecker.prototype.requireBoolean = function (key) {
    var self = this;
    if (!self.data.hasOwnProperty(key)) {
        return self.returnError(key, self.data[key], "必选参数，必须是一个Bool");
    }
    if (!lodash.isBoolean(self.data[key])) {
        return self.returnError(key, self.data[key], "必选参数，必须是一个Bool");
    }
    return self.data[key];
};
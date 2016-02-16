'use strict';

var Logger = require("./log4js/helper.js");

module.exports = function (path) {
    return new Logger(path);
}

'use strict';

var mysql = require("mysql");

module.exports = function (opt) {
    var options = {
        connectionLimit: 10,//连接池最多可以创建连接数
        queueLimit: 0, // 队伍中等待连接的最大数量，0为不限制。
        'host': opt.host,
        'port': opt.port,
        'database': opt.database,
        'user': opt.user,
        'password': opt.password,
        'multipleStatements': true //允许执行多条sql语句
    };
    if (opt.connectionLimit) {
        options["connectionLimit"] = opt.connectionLimit;
    }
    if (opt.charset) {
        options["charset"] = opt.charset;
    }
    if (opt.supportBigNumbers) {
        options["supportBigNumbers"] = opt.supportBigNumbers;
    }
    if (opt.bigNumberStrings) {
        options["bigNumberStrings"] = opt.bigNumberStrings;
    }
    if (opt.connectTimeout) {
        options["connectTimeout"] = opt.connectTimeout;
    }
    var pool = mysql.createPool(options);
    return pool;
};
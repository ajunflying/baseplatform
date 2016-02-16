/**
 * Created by junpinp on 2015/12/24.
 */

'use strict';

var CreateMySql = require("./create.js");

module.exports = Helper;

function Helper() {
    var self = this;
    self.mySqlClient = null;
};

Helper.create = function (opt) {
    var helper = new Helper();
    helper.init(opt);
    return helper;
};

Helper.prototype.init = function (opt) {
    var self = this;
    self.mySqlClient = CreateMySql(opt);
};

/*
 * info:执行mySql语句
 * */
Helper.prototype.ExecuteSql = function (sql, args, callback) {
    var self = this;
    if (self.mySqlClient) {
        self.mySqlClient.getConnection(function (error, connection) {
            if (error) {
                return callback(error);
            }
            var query = connection.query(sql, args || [], function (error, result) {
                if (error) {
                    return callback(error);
                }
                //释放数据库连接。
                connection.release();
                if (result.length > 0 && result[0] instanceof Array) {
                    /*执行多个sql语句了*/
                    result.unshift(null);
                    callback.apply(null, result);
                } else {
                    callback(null, result);
                }
            });
        });
    } else {
        callback(new Error("mySql is null"));
    }
};
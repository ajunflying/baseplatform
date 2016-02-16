/**
 * Created by junpinp on 2016/1/25.
 */
'use strict';
var util = require('util');
var ClassTorole = require('./../core/classTorole.js');

module.exports = Torole;

function Torole() {
    ClassTorole.call(this);
}

util.inherits(Torole, ClassTorole);

Torole.create = function (data) {
    var torole = new Torole();
    torole.init(data);
    return torole;
};

/*获取角色列表*/
Torole.prototype.list = function (data, callback) {
    var self = this;
    var params = [];
    self.pagination(null, null, params, 'order by createdAt desc', function (error, result) {
        callback(error, result);
    }, data.cursor, data.count);
};

/*判断角色是否存在*/
Torole.prototype.judgeName = function (name, callback) {
    var self = this;
    var select = 'select id from torole where name = ?';
    var params = [name];
    self.executeSql(select, params, function (error, result) {
        if (error) {
            return callback(error);
        }
        if (result.length === 0) {
            return callback(null, false);
        }
        callback(null, true);
    });
};

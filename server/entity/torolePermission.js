/**
 * Created by junpinp on 2016/1/29.
 */
'use strict';
var util = require('util');
var ClassTorolePermission = require('./../core/classTorolePermission.js');
var async = require('async');

module.exports = TorolePermission;

function TorolePermission() {
    ClassTorolePermission.call(this);
}

util.inherits(TorolePermission, ClassTorolePermission);

TorolePermission.create = function (data) {
    var torolePermission = new TorolePermission();
    torolePermission.init(data);
    return torolePermission;
};

TorolePermission.prototype.getInfoByRoleId = function (roleId, callback) {
    var self = this;
    var select = 'select permissionId from torolePermission where toroleId=?';
    var params = [roleId];
    self.executeSql(select, params, function (error, result) {
        if (error) {
            return callback(error);
        }
        var list = [];
        result.forEach(function (item) {
            list.push(item.permissionId);
        });
        callback(null, list);
    });
};

/*
 * @permission {
 *    parentId:[id,id,id,]
 * }
 * */
TorolePermission.prototype.toSave = function (roleId, permission, callback) {
    var self = this;
    async.series([
        function (cb) {
            /*先设置原来的无效*/
            var update = 'update torolePermission set disabled=1 where toroleId = ?';
            var params = [roleId];
            self.executeSql(update, params, cb);
        },
        function (cb) {
            /*保存信息的*/
            var insert = 'insert into torolePermission(id,toroleId,moduleId,permissionId,disabled) values';
            var list = [];
            var params = [];
            for (var moduleId in permission) {
                permission[moduleId].forEach(function (item) {
                    list.push('(?,?,?,?,?)');
                    params.push(APP.Library.Tool.uuV4());
                    params.push(roleId);
                    params.push(moduleId);
                    params.push(item);
                    params.push(0);
                });
            }
            insert += list.join(',');
            self.executeSql(insert, params, cb)
        },
        function (cb) {
            /*删除不可用的*/
            var del = 'delete from torolePermission where toroleId = ? and disabled=1';
            var params = [roleId];
            self.executeSql(del, params, cb);
        }
    ], function (error, result) {
        if (error) {
            return callback(error);
        }
        callback(null, true);
    });
};
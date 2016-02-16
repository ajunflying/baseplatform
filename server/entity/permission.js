/**
 * Created by junpinp on 2016/1/20.
 */
'use strict';
var util = require('util');
var ClassPermission = require('./../core/classPermission.js');

module.exports = Permission;

function Permission() {
    ClassPermission.call(this);
}

util.inherits(Permission, ClassPermission);

Permission.create = function (data) {
    var permission = new Permission();
    permission.init(data);
    return permission;
};

/*获取模块列表*/
Permission.prototype.list = function (data, callback) {
    var self = this;
    var params = [];
    self.pagination(null, 'parentId is NULL or parentId = \'\'', params, 'order by createdAt desc', function (error, result) {
        callback(error, result);
    }, data.cursor, data.count);
};

/*获取模块下的权限列表*/
Permission.prototype.listChild = function (data, callback) {
    var self = this;
    var params = [data.id];
    var select = 'select id, parentId, childName, nameDesc from permission where parentId = ? order by createdAt asc';
    self.executeSql(select, params, function (error, result) {
        if (error) {
            return callback(error);
        }
        return callback(null, result);
    });
};

/*判断模块是否存在*/
Permission.prototype.judgeName = function (name, callback) {
    var self = this;
    var select = 'select id from permission where moduleName = ?';
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

/*判断同模块下权限是否存在*/
Permission.prototype.judgeChildName = function (pid, name, callback) {
    var self = this;
    var select = 'select id from permission where parentId = ? and childName = ?';
    var params = [pid, name];
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
Permission.prototype.getAll = function (callback) {
    var self = this;
    var select = 'select id, moduleName, parentId, childName, nameDesc, createdAt from permission order by createdAt asc';
    self.executeSql(select, [], function (error, result) {
        if (error) {
            return callback(error);
        }
        var list = [];
        var rootNode = result.filter(function (item) {
            if (!item.parentId) {
                return item;
            }
        });
        rootNode.forEach(function (item) {
            var obj = {
                root: item,
                child: []
            };
            result.sort(function (o1, o2) {
                return o1.createdAt > o2.createdAt;
            });

            obj.child = result.filter(function (c) {
                if (c.parentId === item.id) {
                    return true;
                }
            });
            list.push(obj);
        });
        callback(null, list);
    });
}

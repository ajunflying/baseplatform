/**
 * Created by junpinp on 2016/1/1.
 */
'use strict';
var util = require('util');
var ClassMenu = require('./../core/classMenu.js');

module.exports = Menu;

function Menu() {
    ClassMenu.call(this);
}

util.inherits(Menu, ClassMenu);

Menu.State = {
    Enabled: 1,
    Disabled: 2,

    Text: {
        '1': '开启',
        '2': '禁用'
    }
};

Menu.create = function (data) {
    var menu = new Menu();
    menu.init(data);
    return menu;
};

/*添加菜单*/
Menu.prototype.add = function (callback) {
    var self = this;
    var insert = 'insert into menu(parentId, `level`, `order`, name, url, `desc`, icon, state, createdAt) values(?,?,?,?,?,?,?,?,?)';
    var params = [];
    params.push(self.parentId);
    params.push(self.level);
    params.push(self.order);
    params.push(self.name);
    params.push(self.url);
    params.push(self.desc);
    params.push(self.icon);
    params.push(self.state);
    params.push(self.createdAt);
    self.executeSql(insert, params, function (error, result) {
        if (error) {
            return callback(error);
        }
        callback(null, result);
    });
};

/*获取菜单列表*/
Menu.prototype.list = function (callback) {
    var self = this;
    var select = 'select id, parentId, level, `order`, icon, name, host, url, `desc`, state from menu where 1=1';
    select += ' order by `level`, `order` asc';
    self.executeSql(select, null, function (error, result) {
        if (error) {
            return callback(error);
        }
        var obj = {};
        var map = self.initMenu(result, obj);

        callback(null, {
            menu: obj,
            map: map
        });
    });
};

/*加载左边菜单*/
Menu.prototype.get = function (callback) {
    var self = this;
    var select = 'select id, parentId, level, `order`, icon, name, url from menu where state=1 order by `level`, `order` ASC';
    self.executeSql(select, null, function (error, result) {
        if (error) {
            return callback(error);
        }
        var obj = {};
        var map = self.initMenu(result, obj);

        callback(null, {
            menu: obj,
            map: map
        })
    });
};

Menu.prototype.initMenu = function (list, obj) {
    var idlist = [];
    var map = {};
    list.forEach(function (item) {
        idlist.push(item.id);

        obj[item.id] = item;

        var str = item.id;
        var currentId = item.id;
        var c = function (id) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].id === id) {
                    if (list[i]['parentId'] === 0) {
                        map[currentId] = str.toString();
                    } else {
                        str += '-' + list[i]['parentId'];
                        c(list[i]['parentId']);
                    }
                }
            }
        }
        c(item.id);
    });

    for (var k in map) {
        if (map[k].indexOf('-') > -1) {
            var temp = map[k].split('-');
            map[k] = temp.reverse().join('-');
        }
    }
    var _returnList = [];
    for (var i = 0; i < idlist.length; i++) {
        if (map[idlist[i]]) {
            _returnList.push(map[idlist[i]]);
        }
    }
    return _returnList;
};

/*有父ID获取菜单*/
Menu.prototype.getMenuByParentId = function (id, callback) {
    var self = this;
    var select = 'select * from menu where parentId = ? order by `order` asc';
    var params = [id];
    self.executeSql(select, params, callback);
};
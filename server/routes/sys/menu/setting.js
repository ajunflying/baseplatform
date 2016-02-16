/**
 * Created by junpinp on 2016/1/3.
 */
'use strict';

var Logger = APP.Library.Logger.getLogger(__filename);


module.exports = {
    Method: APP.Method.Post,
    Main: function (data, callback) {
        var menu = APP.Entity.Menu.create();
        menu.list(function (error, result) {
            if (error) {
                return callback(error);
            }
            var _list = [];
            result.map.forEach(function (item) {
                var obj = result.menu[item.split('-').pop()];
                var s = '';
                obj.levelCount = 0;
                for (var i = 0; i < obj.level; i++) {
                    s += ' — ';
                    obj.levelCount++;
                }
                obj._level = s;
                _list.push(obj);
            });

            var list = [];

            var rootMenu = _list.filter(function (m) {
                if (m.parentId === 0) {
                    return m;
                }
            });
            rootMenu.sort(function (o1, o2) {
                return o1.order - o2.order;
            });

            var listId = [];
            rootMenu.forEach(function (item) {
                var child = _list.filter(function (m) {
                    if (m.parentId === item.id) {
                        return m;
                    }
                });
                child.sort(function (o1, o2) {
                    return o1.order - o2.order;
                });
                var childId = [];
                child.forEach(function (item) {
                    childId.push(item.id.toString());
                });
                listId.push(item.id.toString());
                listId = listId.concat(childId);
            });

            var __child = _list.filter(function (m) {
                if (m.level === 2) {
                    return m;
                }
            });
            for (var i = 0; i < __child.length; i++) {

                var index = listId.indexOf(__child[i].parentId.toString());

                if (index > -1) {
                    listId.splice(index + 1, 0, __child[i].id.toString());
                }

            }

            for (var i = 0; i < listId.length; i++) {
                var _obj = result.menu[listId[i]];
                _obj.stateText = APP.Entity.Menu.State.Text[_obj.state.toString()];
                list.push(_obj);
            }

            list.forEach(function(item){
                item.name_ = item.name;
                if(item.levelCount == 0){
                    item.name = '<color style="color:green"><b>' + item.name + '</b></color>';
                }
                if(item.levelCount == 1){
                    item.name = '<color style="color:#3598dc;">' + item.name + '</color>';
                }
                if(item.levelCount == 2){
                    item.name = '<color style="color:#26a69a;">' + item.name + '</color>';
                }
            });

            var msg = new APP.ReturnMessage(null, {
                list: list,
                count: list.length
            });
            callback(null, msg);
        });
    }
};
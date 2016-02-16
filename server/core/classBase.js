/**
 * Created by junpinp on 2015/12/25.
 */
'use strict';

module.exports = ClassBase;

function ClassBase() {
}

/*
 * info:给对象赋值
 * */
ClassBase.prototype.init = function (arg) {
    if (!arg) return;
    var self = this;
    if (typeof arg === 'string' || (typeof(arg) === 'number' && arg % 1 === 0)) {
        self.id = arg;
        return;
    }
    for (var k in arg) {
        if (typeof(self[k]) === 'number' && self[k] % 1 === 0) {
            self[k] = parseInt(arg[k]);
        } else if (typeof(self[k]) === 'number') {
            self[k] = arg[k];
        } else if (typeof(self[k]) === 'string') {
            self[k] = arg[k];
        } else if (typeof(self[k]) === 'boolean') {
            self[k] = arg[k];
        } else if (new Date(self[k]) !== 'Invalid Date') {
            self[k] = new Date(self[k]);
        }
    }
};

/*
 * info:获取对象属性集合
 * */
ClassBase.prototype.getAttrs = function () {
    var self = this;
    var attributes = [];
    for (var k in self) {
        if (typeof(self[k]) !== 'function' && typeof(self[k]) !== 'object') {
            attributes.push(k);
        }
    }
    return attributes;
};

/*
 * info:获取对象的属性和值，返回对象
 * */
ClassBase.prototype.getAttrValue = function () {
    var self = this;
    var avs = {};
    for (var k in self) {
        if (typeof(self[k]) !== 'function' && typeof(self[k]) !== 'object') {
            avs[k] = self[k];
        }
    }
    return avs;
};


/*获取mysql操作对象*/
ClassBase.prototype.getMySqlOperate = function () {
    if (!APP.DbClient.MySql) {
        throw new APP.DbError(APP.ErrorMsg.DB_ERROR, new Error('APP.DbClient.MySql is null'));
        return;
    }
    return APP.DbClient.MySql;
};

ClassBase.prototype.getKey = function () {
    var self = this;
    return self.constructor.name.toLowerCase();
};

/*
 * :执行sql语句
 *
 { fieldCount: 0,
 affectedRows: 2,
 insertId: 0,
 serverStatus: 34,
 warningCount: 0,
 message: '',
 protocol41: true,
 changedRows: 0 }
 * */
ClassBase.prototype.executeSql = function (sql, args, callback) {
    var self = this;

    if (self.getMySqlOperate()) {
        self.getMySqlOperate().ExecuteSql(sql, args || [], function () {
            var error = arguments[0];
            if (error) {
                return callback(new APP.DbError(APP.ErrorMsg.DB_ERROR, error));
            }
            callback.apply(null, arguments);
        });
    } else {
        callback(new APP.DbError(APP.ErrorMsg.DB_ERROR, new Error('mysql client is null')));
    }
};


/*
 * @分页
 * */
ClassBase.prototype.pagination = function (filedList, where, params, orderBy, callback, cursor, count) {
    var self = this;
    var entity = self.getAttrValue();
    var key = self.getKey();
    if (!key) {
        return callback(new APP.DbError(APP.ErrorMsg.DB_ERROR, new Error('entity key not exist! not allow exec sql pagination')));
    }
    var select = 'select ';
    var filed = "";
    if (filedList && typeof filedList === 'array') {
        filedList.forEach(function (item) {
            for (var k in entity) {
                if (k === item) {
                    filed += self.exceptFile(k) + ",";
                }
            }
        });
    } else {
        for (var k in entity) {
            filed += self.exceptFile(k) + ",";
        }
    }
    if (filed.length > 0) {
        filed = filed.substring(0, filed.length - 1);
    }

    select = select + filed + " from " + key;
    if (where) {
        select += ' where ' + where;
    } else {
        select += " where 1=1";
    }

    params = params || [];

    var selectCount = ';select count(1) as "count" from ' + self.getKey() + ' where ' + (where || '1=1');
    var paramsCount = params;

    if (orderBy) {
        select += ' ' + (orderBy || '');
    }

    cursor = cursor || 0;
    count = count || 10;

    select += ' limit ' + cursor + ', ' + count;

    select += selectCount;
    params = params.concat(paramsCount);

    console.log(select, params);

    self.executeSql(select, params, function (error, list, count) {
        if (error) {
            return callback(new APP.DbError(APP.ErrorMsg.DB_ERROR, error));
        }
        callback(null, {
            list: list,
            count: count[0].count || 0
        });
    });
};

/*
 * :查询对象
 * */
ClassBase.prototype.load = function (callback, filedList) {
    var self = this;
    var entity = self.getAttrValue();
    var key = self.getKey();
    if (!key) {
        return callback(new APP.DbError(APP.ErrorMsg.DB_ERROR, new Error('entity key not exist! not allow exec sql load')));
    }
    if (!entity.id) {
        return callback(new APP.DbError(APP.ErrorMsg.DB_ERROR, new Error('load entity id not exist')));
    }
    var params = [entity.id];
    var select = "select ";
    var filed = "";
    if (filedList && filedList.length > 0) {
        filedList.forEach(function (item) {
            for (var k in entity) {
                if (k === item) {
                    filed += self.exceptFile(k) + ",";
                }
            }
        });
    } else {
        for (var k in entity) {
            filed += self.exceptFile(k) + ",";
        }
    }

    if (filed.length > 0) {
        filed = filed.substring(0, filed.length - 1);
    }
    select = select + filed + " from " + key + " where id = ?";
    self.executeSql(select, params, function (error, reply) {
        if (error) {
            return callback(new APP.DbError(APP.ErrorMsg.DB_ERROR, error));
        }
        if (!reply || !(reply instanceof  Array) || reply.length === 0) {
            return callback(new APP.DbError(APP.ErrorMsg.NOT_FIND_DATA, null, ' class = ' + self.constructor.name + ', id = ' + self.id));
        }
        self.init(reply[0]);
        return callback(null, reply[0]);
    });
};

/*
 * :插入数据
 * */
ClassBase.prototype.insert = function (callback) {
    var self = this;
    var entity = self.getAttrValue();
    var key = self.getKey();
    if (!key) {
        return callback(new APP.DbError(APP.ErrorMsg.DB_ERROR, new Error('entity key not exist! not allow exec sql insert')));
    }
    if (!entity.id) {
        return callback(new APP.DbError(APP.ErrorMsg.DB_ERROR, new Error('insert entity id not exist')));
    }
    var params = [];
    var insert = 'insert into ' + key;
    var filed = '';
    var filedStr = '';
    for (var k in entity) {
        filed += self.exceptFile(k) + ',';
        filedStr += '?,';
        params.push(entity[k]);
    }
    if (filed.length > 0) {
        filed = filed.substring(0, filed.length - 1);
    }
    if (filedStr.length > 0) {
        filedStr = filedStr.substring(0, filedStr.length - 1);
    }
    insert = insert + '(' + filed + ') values(' + filedStr + ')';
    console.log(insert);
    self.executeSql(insert, params, function (error, result) {
        if (error) {
            return callback(new APP.DbError(APP.ErrorMsg.DB_ERROR, error));
        }
        callback(null, result);
    });
};

/*
 * :删除数据
 * */
ClassBase.prototype.delete = function (callback) {
    var self = this;
    var entity = self.getAttrValue();
    var key = self.getKey();
    if (!key) {
        return callback(new APP.DbError(APP.ErrorMsg.DB_ERROR, new Error('entity key not exist! not allow exec sql delete')));
    }
    if (!entity.id) {
        return callback(new APP.DbError(APP.ErrorMsg.DB_ERROR, new Error('delete entity id not exist')));
    }
    var params = [entity.id];
    var del = "delete from " + key + " where id=?";
    console.log(del);
    self.executeSql(del, params, function (error, result) {
        if (error) {
            return callback(new APP.DbError(APP.ErrorMsg.DB_ERROR, error));
        }
        callback(null, result);
    });
};

/*
 * info;更新
 * filedList=[]，需要更新的字段
 * */
ClassBase.prototype.update = function (filedList, callback) {
    var self = this;
    var entity = self.getAttrValue();
    var key = self.getKey();
    if (!key) {
        return callback(new Error("entity key not exist! not allow exec sql update"));
    }
    if (!entity.id) {
        return callback(new Error("update entity id not exist"));
    }
    if (!filedList || filedList.length <= 0) {
        return callback(new Error("update filed not is array"));
    }
    var params = [];
    var update = 'update ' + key + ' set ';
    var filed = '';
    filedList.forEach(function (item) {
        for (var k in entity) {
            if (k === item && k !== 'createdAt') {
                filed += self.exceptFile(k) + "=?,";
                params.push(entity[k]);
            }
        }
    });

    if (filed.length > 0) {
        filed = filed.substring(0, filed.length - 1);
    }
    update = update + filed + " where id=?";
    params.push(entity.id);
    console.log(update);
    self.executeSql(update, params, function (error, result) {
        if (error) {
            return callback(new APP.DbError(APP.ErrorMsg.DB_ERROR, error));
        }
        callback(null, result);
    });
};

/*更新整個對象，最好是load完后再执行*/
ClassBase.prototype.save = function (callback) {
    var self = this;
    var entity = self.getAttrValue();
    var key = self.getKey();
    if (!key) {
        return callback(new Error("entity key not exist! not allow exec sql save"));
    }
    if (!entity.id) {
        return callback(new Error("update entity id not exist"));
    }

    var params = [];
    var update = 'update ' + key + ' set ';
    var filed = '';
    for (var k in entity) {
        if (k !== 'createdAt') {
            filed += self.exceptFile(k) + "=?,";
            params.push(entity[k]);
        }
    }

    if (filed.length > 0) {
        filed = filed.substring(0, filed.length - 1);
    }
    update = update + filed + " where id=?";
    params.push(entity.id);
    self.executeSql(update, params, function (error, result) {
        if (error) {
            return callback(new APP.DbError(APP.ErrorMsg.DB_ERROR, error));
        }
        callback(null, result);
    });
};


/*
 * @调用带参数的存储过程，call.name(1,2,3,@c,@b);1,2,3为输入参数，@c,@b则为输出参数
 * */
/*
 * @简单的调用存储过程
 * */
ClassBase.prototype.callProcedure = function (procedureName, params, callback) {
    var self = this;
    self.executeSql("call " + procedureName + "(" + params.join(',') + ")", callback);
};

ClassBase.prototype.exceptFile = function (key) {
    if (key == 'order'
        || key == 'desc'
        || key == 'level') {
        return '`' + key + '`';
    }
    return key;
};
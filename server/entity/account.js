/**
 * Created by junpinp on 2015/12/26.
 */
'use strict';
var util = require('util');
var ClassAccount = require('./../core/classAccount.js');

module.exports = Account;

function Account() {
    ClassAccount.call(this);
}

util.inherits(Account, ClassAccount);

Account.create = function (data) {
    var account = new Account();
    account.init(data);
    return account;
};

Account.prototype.register = function(name, pwd, callback, email){
    var self = this;
    self.id = APP.Library.Tool.uuV4();
    self.name = name;
    self.pwd = APP.Library.Tool.md5(pwd);
    self.insert(callback);
};

Account.prototype.list = function (data, callback) {
    var self = this;

    var where = '', params = [];
    if (data.name) {
        where += 'name like \'%' + data.name + '%\'';
    }

    self.pagination(null, where, params, 'order by createdAt desc', function (error, result) {
        callback(error, result);
    }, data.cursor, data.count);
};
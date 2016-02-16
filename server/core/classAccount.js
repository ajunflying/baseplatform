/**
 * Created by junpinp on 2015/12/25.
 */
'use strict';
var util = require('util');
var ClassBase = require('./classBase.js');

module.exports = ClassAccount;

function ClassAccount(){
    ClassBase.call(this);
    this.id = '';
    this.name = '';
    this.pwd = '';
    this.loginTime = parseInt((new Date()) / 1000);
    this.createdAt = parseInt((new Date()) / 1000);
}

util.inherits(ClassAccount, ClassBase);
/**
 * Created by junpinp on 2015/12/29.
 */
'use strict';
var util = require('util');
var ClassBase = require('./classBase.js');

module.exports = ClassAppserver;

function ClassAppserver(){
    ClassBase.call(this);
    this.id = '';
    this.serverName = '';
    this.serverHost = '';
    this.masterKey = '';
    this.appKey = '';
    this.state = 1;
    this.createdAt = parseInt((new Date()) / 1000);
}

util.inherits(ClassAppserver, ClassBase);
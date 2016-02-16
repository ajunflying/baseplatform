/**
 * Created by junpinp on 2016/1/20.
 */
'use strict';
var util = require('util');
var ClassBase = require('./classBase.js');

module.exports = ClassPermission;

function ClassPermission() {
    ClassBase.call(this);

    this.id = '';
    this.moduleName = '';
    this.parentId = '';
    this.childName = '';
    this.nameDesc = '';
    this.operator = '';//添加人
    this.createdAt = parseInt((new Date()) / 1000);
}

util.inherits(ClassPermission, ClassBase);
/**
 * Created by junpinp on 2016/1/29.
 */
'use strict';
var util = require('util');
var ClassBase = require('./classBase.js');

module.exports = ClassTorolePermission;

function ClassTorolePermission() {
    ClassBase.call(this);
    this.id = '';
    this.toroleId = '';
    this.moduleId = '';
    this.permissionId = '';
    this.disabled = 0;
}

util.inherits(ClassTorolePermission, ClassBase);
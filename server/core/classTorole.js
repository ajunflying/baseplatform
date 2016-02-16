/**
 * Created by junpinp on 2016/1/25.
 */
'use strict';
var util = require('util');
var ClassBase = require('./classBase.js');

module.exports = ClassTorole;

function ClassTorole() {
    ClassBase.call(this);

    this.id = '';
    this.name = '';
    this.desc = '';
    this.visible = '';
    this.operator = '';
    this.createdAt = parseInt((new Date()) / 1000);
}

util.inherits(ClassTorole, ClassBase);
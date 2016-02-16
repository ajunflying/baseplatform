/**
 * Created by junpinp on 2016/1/1.
 */
'use strict';
var util = require('util');
var ClassBase = require('./classBase.js');

module.exports = ClassMenu;

function ClassMenu(){
    ClassBase.call(this);

    this.id = 0;
    this.parentId = 0;
    this.level = 0;
    this.order = 0;
    this.name = '';
    this.host = '';
    this.url = '';
    this.icon = '';
    this.desc = '';
    this.state = 1;
    this.createdAt = parseInt((new Date()) / 1000);

}

util.inherits(ClassMenu, ClassBase);
/**
 * Created by junpinp on 2015/12/25.
 */
var path = require('path');
var fileHelper = require('./library/fileHelper.js');

exports.Common = fileHelper.loadPath(path.join(process.cwd(), "common")).Common;
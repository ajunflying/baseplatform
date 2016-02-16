/**
 * Created by junpinp on 15-3-30.
 */
'use strict';
var path = require('path');
var log4js = require("log4js");

var logpath = path.join(process.cwd(), 'logs/log_');

log4js.configure({
	appenders: [
		{ type: 'console' },
		{
			type: 'dateFile',
			filename: logpath,
			pattern: "yyyyMMdd.log",
			absolute: true,
			maxLogSize: 1024,
			alwaysIncludePattern: true
		}
	],
	replaceConsole: true
});


log4js.setGlobalLogLevel(log4js.levels.DEBUG);

exports.setLogLevel = function(level){
	log4js.setGlobalLogLevel(level || log4js.levels.DEBUG);
};

exports.getLogger = function(file){
	return log4js.getLogger(file);
};
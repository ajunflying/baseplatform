var log4js = require('log4js');
var fs = require("fs");
var path = require("path");

// 加载配置文件
var objConfig = require("./config.js");

var PatternType = {
	Day: "yyyyMMdd",
	Hours: "yyyyMMddhh"
};

module.exports = LogForHelper;

/*customBaseDir日志文件路径，不存在时默认项目根目录下logs文件夹下
 pattern=Day||Hours
 category=true|false是否在控制台输出日志*/
function LogForHelper(customBaseDir, pattern, category){
	if (!customBaseDir) {
		customBaseDir = process.cwd() + "\\logs\\";
	}

	objConfig.customBaseDir = customBaseDir;
	if (!pattern || !PatternType.hasOwnProperty(pattern)) {
		pattern = "Day";
	}
	objConfig.appenders.forEach(function (item) {
		if (item.hasOwnProperty("pattern")) {
			item.pattern += PatternType[pattern] + ".log";
		}
	});

	if (category) {
		objConfig.appenders[0]["category"] = "console";
	} else {
		delete objConfig.appenders[0]["category"];
	}

	ct();

	log4js.configure(objConfig);

	this.logInfo = log4js.getLogger('logInfo');
	this.logDebug = log4js.getLogger('logDebug');
	this.logWarn = log4js.getLogger('logWarn');
	this.logError = log4js.getLogger('logError');
};

LogForHelper.prototype.info = function (msg, filename) {
	if (msg == null)
		msg = "";
	this.logInfo.info((filename || "") + " " + msg);
};

LogForHelper.prototype.debug = function (msg, filename) {
	if (msg == null)
		msg = "";
	this.logDebug.debug((filename || "") + " " + msg);
};

LogForHelper.prototype.warn = function (msg, filename) {
	if (msg == null)
		msg = "";
	this.logWarn.warn((filename || "") + " " + msg);
};

LogForHelper.prototype.error = function (msg, filename) {
	if (msg == null)
		msg = "";
	this.logError.error((filename || "") + " " + msg);
};

/*url服务地址，data日志数据*/
LogForHelper.prototype.toOther = function(url, data, callback){

};

function ct() {
// 检查配置文件所需的目录是否存在，不存在时创建
	if (objConfig.appenders) {
		var baseDir = objConfig["customBaseDir"];
		var defaultAtt = objConfig["customDefaultAtt"];

		for (var i = 0, j = objConfig.appenders.length; i < j; i++) {
			var item = objConfig.appenders[i];
			if (item["type"] == "console")
				continue;

			if (defaultAtt != null) {
				for (var att in defaultAtt) {
					if (item[att] == null)
						item[att] = defaultAtt[att];
				}
			}
			if (baseDir != null) {
				if (item["filename"] == null)
					item["filename"] = baseDir;
				else
					item["filename"] = baseDir + item["filename"];
			}
			var fileName = item["filename"];
			if (fileName == null)
				continue;
			var pattern = item["pattern"];
			if (pattern != null) {
				fileName += pattern;
			}
			var category = item["category"];
			if (!isAbsoluteDir(fileName))//path.isAbsolute(fileName))
				throw new Error("配置节" + category + "的路径不是绝对路径:" + fileName);
			var dir = path.dirname(fileName);
			checkAndCreateDir(dir);
		}
	}
}

function checkAndCreateDir(dir) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
}

function isAbsoluteDir(path) {
	if (path == null)
		return false;
	var len = path.length;

	var isWindows = process.platform === 'win32';
	if (isWindows) {
		if (len <= 1)
			return false;
		return path[1] == ":";
	} else {
		if (len <= 0)
			return false;
		return path[0] == "/";
	}
}
module.exports = {
	"customBaseDir": "",
	"customDefaultAtt": {
		"type": "dateFile",
		"absolute": true,
		"alwaysIncludePattern": true,
		"maxLogSize": 1024
	},
	"appenders": [
		{
			"type": "console",
			"category": "console"
		},
		{
			"pattern": "debug\\",
			"category": "logDebug"
		},
		{
			"pattern": "info\\",
			"category": "logInfo"
		},
		{
			"pattern": "warn\\",
			"category": "logWarn"
		},
		{
			"pattern": "error\\",
			"category": "logError"
		}
	],
	"replaceConsole": true,
	"levels": {
		"logInfo": "INFO",
		"logDebug": "DEBUG",
		"logWarn": "WARN",
		"logError": "ERROR"
	}
}
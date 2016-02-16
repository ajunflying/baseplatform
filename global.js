/**
 * Created by junpinp on 2015/12/22.
 */
var path = require('path');

var MySqlHelper = require('./db/mysql/helper.js');

var LoadCommon = require('./common/load.js').Common;

module.exports = function (env) {
    global.APP = {
        Env: env,
        Method: {Get: 'Get', Post: 'Post'},
        Routes: {
            Get: {},
            Post: {}
        },
        ReturnMessage: require('./server/connect/ReturnMessage.js'),
        DbClient: {
            MySql: null
        }
    };

    LoadCommon.Library.FileHelper.merge(APP, LoadCommon);
    delete APP.Load;//合并后删除到处的公共库对象；

    /*加载私有库*/
    APP.Library.FileHelper.merge(APP.Library || (APP.Library = {}),
        APP.Library.FileHelper.loadPath(path.join(process.cwd(), 'server/library'))['Library']);

    /*加载私有配置文件*/
    APP.Library.FileHelper.merge(APP.Config || (APP.Config = {}),
        APP.Library.FileHelper.loadPath(path.join(process.cwd(), 'server/config'))['Config']);

    /*加载数据库对象*/
    APP.Library.FileHelper.merge(APP.Entity || (APP.Entity = {}),
        APP.Library.FileHelper.loadPath(path.join(process.cwd(), 'server/entity'))['Entity']);

    APP.InputChecker = APP.Library.InputChecker;
    APP.ServerError = APP.Library.ServerError;
    APP.DbError = APP.Library.DbError;
    APP.ErrorMsg = APP.Library.ErrorMsg;


    APP.DbClient.MySql = MySqlHelper.create(APP.Config['Dev']['mySql']);
}
/**
 * Created by junpinp on 2015/12/29.
 */
'use strict';
var util = require('util');
var ClassAppserver = require('./../core/classAppserver.js');

module.exports = Appserver;

function Appserver() {
    ClassAppserver.call(this);
}

util.inherits(Appserver, ClassAppserver);

Appserver.create = function (data) {
    var appserver = new Appserver();
    appserver.init(data);
    return appserver;
};

Appserver.State = {
    Create: 1,

    Text: {
        1: '创建'
    }
};

Appserver.prototype.register = function (serverName, serverHost, callback) {
    var self = this;
    self.id = APP.Library.Tool.uuV4();
    self.serverName = serverName;
    self.serverHost = serverHost;
    self.masterKey = APP.Library.Tool.uuV4();
    self.appKey = APP.Library.Tool.uuV4();
    self.state = Appserver.State.Create;

    self.insert(function (error, result) {
        if (error) {
            return callback(error);
        }
        return callback(null, result);
    });
};
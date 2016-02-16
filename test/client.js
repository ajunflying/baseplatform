/**
 * Created by junpinp on 15-11-10.
 */


var http = require("http");

module.exports = clientTest;
function clientTest() {
    var self = this;
    self.options = {
        hostname: 'localhost',
        port: 9000,
        path: '',
        method: 'POST'
    };
}

clientTest.prototype.send = function (api, data, callback) {
    var self = this;
    self.options.path = '/' + api;
    self.options.headers = {
        "Content-Type": "application/json; charset=utf-8"
    }
    var request = http.request(self.options, function (res) {
        var list = [];
        var len = 0;
        res.on("data", function (chunk) {
            len += chunk.length;
            list.push(chunk);
        });
        res.on("error", function (err) {
            console.log("client:", err);
        });
        res.on("end", function () {
            var buffer = Buffer.concat(list, len);
            callback && callback(null, buffer.toString());
        });
    });
    request.write(JSON.stringify(data));
    request.end();
};
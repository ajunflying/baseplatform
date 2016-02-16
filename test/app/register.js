/**
 * Created by junpinp on 2015/12/29.
 */
var Client = require('./../client.js');

var client = new Client();
var obj = {
    serverName: 'testapp',
    serverHost: 'http://localhost:3000/'
}

client.send('app/register', obj, function (error, reply) {
    if (error) {
        console.log(error);
        return;
    }
    console.log(reply);
});
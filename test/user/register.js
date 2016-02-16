/**
 * Created by junpinp on 2015/12/27.
 */
var Client = require('./../client.js');

var client = new Client();
var obj = {
    name: 'ces'+(parseInt(Math.round() * 100)),
    pwd: '123456'
}

client.send('user/register', obj, function (error, reply) {
    if (error) {
        console.log(error);
        return;
    }
    console.log(reply);
});
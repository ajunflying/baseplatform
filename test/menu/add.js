/**
 * Created by junpinp on 2016/1/1.
 */
var Client = require('./../client.js');

var client = new Client();
var obj = {
    pid: 'root',
    sid: '',
    name: '跟菜单',
    order: 0
}

client.send('user/register', obj, function (error, reply) {
    if (error) {
        console.log(error);
        return;
    }
    console.log(reply);
});
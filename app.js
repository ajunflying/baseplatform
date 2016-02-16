var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var domain = require('domain');

var env = process.argv.length > 2 ? process.argv[2] : 'dev';

require('./global.js')(env);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('public'));


//未处理异常捕获 middleware
app.use(function (req, res, next) {
    var d = domain.create();
    d.add(req);
    d.add(res);
    d.on('error', function (err) {
        console.error('uncaughtException url=%s, msg=%s', req.url, err.stack || err.message || err);
        if (!res.finished) {
            res.statusCode = 500;
            res.setHeader('content-type', 'application/json; charset=UTF-8');
            if (APP.Env === 'hi') {
                res.end('未知错误');
            } else {
                res.end(err.message);
            }
        }
    });
    d.run(next);
});

require('./server/loadRoutes.js')(app);


// 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
if (APP.Env != 'hi') {
    app.use(function (err, req, res, next) { // jshint ignore:line
        if (err) {
            console.error('出错了，看看是哪儿吧， ', err);
        }
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// 如果是非开发环境，则页面只输出简单的错误信息
app.use(function (err, req, res, next) { // jshint ignore:line
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


console.log(APP);

app.listen(9000, function () {
    console.log('server start ', 9000);
});
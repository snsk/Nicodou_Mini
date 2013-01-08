
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

/* コメントアウトします
http.createServer(app).listen(app.get('port'), function(){
 console.log("Express server listening on port " + app.get('port'));
 });
*/

/** 以下を追記します **/
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
var socket = require('socket.io').listen(server);
socket.on('connection', function(client) {
    client.on('message', function(event){
   // クライアントからのメッセージをコンソールに出力
	console.log("app.js:" + event.message);
   // 送信元へメッセージ送信
	client.emit('message', event.message);
   // 送信元以外の全てのクライアントへメッセージ送信
	client.broadcast.emit('message', event.message);
    });
});
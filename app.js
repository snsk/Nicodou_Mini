//server

/*
require('nodefly').profile(
    '7b8d021e-85a2-4f22-9f67-f4ba05d44d5b',
    ['ethmusicaloop','Heroku']
);
*/

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
var peoples = 0;

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

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
var socket = require('socket.io').listen(server);
socket.on('connection', function(client) {

    peoples++;
    console.log("app.js count:" + peoples);
    client.emit('count', peoples);
    client.broadcast.emit('count', peoples);

    client.on('message', function(event){
	console.log("app.js:" + event.message);
	client.emit('message', event.message);
	client.broadcast.emit('message', event.message);
    });
    client.on('change', function(event){
	console.log("app.js:" + event.message);
	client.emit('change', event.message);
	client.broadcast.emit('change', event.message);
    });
    client.on('event', function(event){
	console.log("app.js:" + event.message);
	client.emit('event', event.message);
	client.broadcast.emit('event', event.message);
    });
    client.on('disconnect', function() {
	peoples--;
	console.log("app.js count:" + peoples);
	client.emit('count', peoples);
	client.broadcast.emit('count', peoples);
    });

});



var express     = require('express');
var routes      = require('./routes');
var http        = require("http");
var fs	        = require("fs");
var mongoose    = require("mongoose");
var config      = require('konfig')()
var Schema	= mongoose.Schema;
var ObjectId	= Schema.ObjectId;
var app 	= express.createServer();
var db		= mongoose.connect("mongodb://" +config.app.db_user+":"+config.app.db_passwd+"@"+config.app.db_host + "/" + config.app.db_name);
var MongoStore = require('connect-mongo')(express);
//mongodb://<dbuser>:<dbpassword>@ds027479.mongolab.com:27479/postit

var io = require('socket.io').listen(app)
io.set('log level', 1);

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');    
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    //app.use(express.session({ secret: 'your secret here' }));
    app.use(express.session({
	secret: "changeme",
	store: new MongoStore({
	    db: config.app.db_name
	})
    }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

mongoose.model("User", require("./models/user").User);
mongoose.model("Post", require("./models/post").Post);
mongoose.model("Workspace", require("./models/workspace").Workspace);
require('./controllers/user')(app);

app.listen(config.app.port, function() {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

io.sockets.on('connection', function (socket) {

    socket.on('new user', function (data) {
	console.log("Socket.io : new user connect "+ data.pseudo );
	socket.set('workspace', data.workspace, function() { 
	    console.log('workspace' + data.workspace + ' saved'); 
	});
	socket.set('pseudo', data.pseudo);
   	socket.join(data.workspace);
	//socket.broadcast.to(data.workspace).emit('new user', data);
	//io.sockets.in('room').emit('event_name', data)
	io.sockets.in(data.workspace).emit('new user', data);
    });

    socket.on('new post', function (data) {
	console.log("Socket.io : new post created "+ data.title );
	//socket.broadcast.to(data.workspace).emit('create post', data);
	io.sockets.in(data.workspace).emit('create post', data);
    });

    socket.on('change post position', function (data) {
	console.log("Socket.io : change post position  "+ data.title );
	io.sockets.in(data.workspace).emit('change post position', data);
	//socket.broadcast.to(data.workspace).emit('change post position', data);
    });

     socket.on('delete post', function (data) {
	 console.log("Socket.io : Delete post  "+ data.title );
	 io.sockets.in(data.workspace).emit('delete post', data);
	 //socket.broadcast.to(data.workspace).emit('delete post', data);
     });

    socket.on('my other event', function (data) {
	console.log(data);
    });

     socket.on('disconnect', function () {
    // 	//io.sockets.emit('user disconnected');
     	console.log("user disconnected");
     });


});
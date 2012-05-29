
/**
 * Module dependencies.
 */

var express     = require('express');
//var routes      = require('./routes');
//var connect     = require('connect');
var http        = require("http");
var fs	        = require("fs");
var mongoose    = require("mongoose");
var MongoStore = require('express-session-mongo');


//var controller		= require("./util/controller");

var Schema	= mongoose.Schema;
var ObjectId	= Schema.ObjectId;
var db_host	= "127.0.0.1";
var db_name	= "postit-dev";
var app_version	= "0.0.1";
var app_port	= 3000;

var app 	= express.createServer();
var db		= mongoose.connect("mongodb://" + db_host + "/" + db_name);

var app = module.exports = express.createServer();

var io = require('socket.io').listen(app)
io.set('log level', 1); // reduce logging

// mongoose.model("User", require("./models/user").User);
// mongoose.model("Post", require("./models/post").Post);
// require('./controllers/user')(app);
// Add other controllers here
//require('controllers/signup')(app);

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');    
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    //app.use(express.session({ store: new MongoStore() }));
    app.use(express.session({ secret: 'your secret here' }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
   
});


mongoose.model("User", require("./models/user").User);
mongoose.model("Post", require("./models/post").Post);
mongoose.model("Workspace", require("./models/workspace").Workspace);
require('./controllers/user')(app);


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.listen(app_port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

io.sockets.on('connection', function (socket) {


    socket.on('new post', function (data) {
	console.log("Socket.io : new post created "+ data.title );
	socket.broadcast.emit('create post', data);
    });

    socket.on('change post position', function (data) {
	console.log("Socket.io : change post position  "+ data.title );
	socket.broadcast.emit('change post position', data);
    });

     socket.on('delete post', function (data) {
	 console.log("Socket.io : Delete post  "+ data.title );
	 socket.broadcast.emit('delete post', data);
     });

    socket.on('my other event', function (data) {
	console.log(data);
    });


});
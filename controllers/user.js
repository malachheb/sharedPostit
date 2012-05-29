var mongoose	= require("mongoose");
var User 	= mongoose.model("User");
var Post        = mongoose.model("Post");
var Workspace   = mongoose.model("Workspace");

module.exports = function(app) {
    app.get("/", index);
    app.get("/users", users);
    app.post("/start", start);
    app.get("/new", new_user);
    app.post("/post/new", new_post);
    app.put("/post/edit/:id", edit_post);
    app.del("/post/delete/:id", delete_post);

}

function index(req, res) {
    // res.writeHead(200, {"Content-Type": "text/plain"});
    // res.write("user request / url");
    // res.end();
    res.render('index',{
	    title : "Shared Postit"
	});
}

function start(req, res) {
    // var user = new User();
    // user.pseudo = req.body.pseudo;
    // user.save();
    // var workspace = new Workspace();
    // workspace.name = req.body.space;
    // workspace.save();
    // console.log("the user "+ req.body.pseudo + " is logged in the worksapce " + req.body.space);
    req.session.user = req.body.pseudo;
    req.session.workspace = req.body.space;
    Post.find({}, function(error, posts){
	res.render('workspace', {
    	    title : "Workspace",
	    user_pseudo  : req.body.pseudo,
	    posts : posts
	});
    });
    
    
}

function users(req, res) {
    User.find({}, function(error, users){
	res.render('users', {
	    title : "users",
	    users: users
	});
    });
 }

function new_post(req, res)
{
    console.log("current user: "+req.session.user);
    console.log("current workspace: "+req.session.workspace);
    console.log(req.body.title);
    console.log(req.body.content);
    var post = new Post();
    post.title= req.body.title;
    post.content= req.body.content;
    post.user = req.session.user;
    post.workspace = req.session.workspace;
    post.save();
    res.send(post);
    // res.writeHead(200, {"Content-Type": "text/plain"});
    // res.write("user created succefully");
    // res.end();
    
}

function edit_post(req, res)
{
    var post_id = req.params.id
    console.log(post_id);
    console.log(req.body.position);

    Post.findOne({_id : req.params.id}, function(error, post){
	if(error) {
	    res.send("no post found", 404);
	} else {
	    post.position = req.body.position;
	    post.save();
	    res.send(post);
	}
    });
        
    // var post = new Post();
    // post.title= req.body.title;
    // post.content= req.body.content;
    // post.user = req.session.user;
    // post.workspace = req.session.workspace;
   // post.save();
   // res.send(post);
    //res.contentType('application/json');  
    //res.writeHead(200);
   // res.json(JSON.stringify(post));
    //res.end();
    // res.writeHead(200, {"Content-Type": "text/plain"});
    // res.write("user created succefully");
    
}

function delete_post(req, res)
{
    console.log(req.params.id);
    Post.findOne({_id : req.params.id}, function(error, post){
	if(error) {
	    res.send("no post found", 404);
	} else {
	    post.remove();
	    res.send(post);
	}
    });
		
}

function new_user(req, res) {
    var user = new User();
    user.mail="lachheb@gmail.com";			
    user.name= "mehrez"
    user.prename= "lachheb"
    user.save();
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write("user created succefully");
    res.end();
}
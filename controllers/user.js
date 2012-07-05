var mongoose	= require("mongoose");
var User 	= mongoose.model("User");
var Post        = mongoose.model("Post");
var Workspace   = mongoose.model("Workspace");

module.exports = function(app) {
    app.get("/", index);
    app.post("/start", start);
    app.post("/new", new_session);
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
    Post.find({workspace : req.session.workspace}, function(error, posts){
	User.find({workspace : req.session.workspace}, function(error, users){
	    res.render('workspace', {
		layout: false,
    		title : "Workspace",
		users  : users,
		posts : posts
	    });
	});
    });
}


function new_post(req, res)
{
    var post = new Post();
    post.title= req.body.title;
    post.content= req.body.content;
    post.user = req.session.user;
    post.workspace = req.session.workspace;
    post.save();
    res.send(post);
}

function edit_post(req, res)
{
    var post_id = req.params.id ;
    Post.findOne({_id : req.params.id}, function(error, post){
	if(error) {
	    res.send("no post found", 404);
	} else {
	    post.position = req.body.position;
	    post.save();
	    console.log("Edit the post: "+post.title);
	    res.send(post);
	}
    });
}

function delete_post(req, res)
{
    Post.findOne({_id : req.params.id}, function(error, post){
	if(error) {
	    res.send("no post found", 404);
	} else {
	    post.remove();
	    console.log("Remove Post: "+ post.title);
	    res.send(post);
	}
    });
}

function new_session(req, res) 
{
    console.log("the user "+ req.body.pseudo + " is logged in the worksapce " + req.body.space);
  
    Workspace.findOne({name : req.body.space}, function(error, space){
    	if(error || space == null) {
    	    var workspace = new Workspace();
    	    workspace.name = req.body.space;
    	    workspace.save();
	    console.log("Workspace created: "+ workspace.name);
    	    req.session.workspace = req.body.space;
    	}
	else {
	    req.session.workspace = req.body.space;
	}
    });
    
//    Create user if is not exist
    User.findOne({pseudo : req.body.pseudo}, function(error, user){
    	if(error || user == null) {
    	    var myuser = new User();
    	    myuser.pseudo = req.body.pseudo;
	    myuser.workspace = req.session.workspace;
	    myuser.status = "connected";
    	    req.session.user = req.body.pseudo;
    	    myuser.save(function (err) {
    		if(err){
    		    console.log("error when created user: "+myuser.pseudo);
    		}
    	    });
    	    console.log("User created: "+myuser.pseudo);
    	    res.send(myuser);
    	}
    	else {
	    user.workspace = req.session.workspace;
	    user.status = "connected";
	    user.save();
	    req.session.user = req.body.pseudo;
    	    res.send(user);
    	}
    });
    
}
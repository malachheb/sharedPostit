var mongoose		= require("mongoose");

var Schema		= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var Post = new Schema({
    title              : String,
    content            : String,
    position           : {type : String, default : "position: relative;"},
    user               : String,
    workspace         : String,
    created_at	       : {type : Date, default : Date.now}
});


exports.Post = Post;

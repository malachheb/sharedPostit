var mongoose		= require("mongoose");

var Schema		= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var User = new Schema({
    pseudo              : String,
    color               : {type : String, default : "#0000FF"},
    workspace           : String,
    status              : String,
    created_at		: {type : Date, default : Date.now}
});

exports.User = User;
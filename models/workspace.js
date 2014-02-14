var mongoose		= require("mongoose");

var Schema		= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var Workspace = new Schema({
    name        : String,
    uid         : String,
    created_at	: {type : Date, default : Date.now}
});


exports.Workspace = Workspace;

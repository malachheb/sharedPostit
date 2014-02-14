$(document).ready(function() {
    var post_actions = new PostActions();
    
    $('#go').live("click", function() {
	post_actions.start_session();	    
	});    
});
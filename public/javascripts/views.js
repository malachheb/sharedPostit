

$(document).ready(function() {
    var socket = io.connect('http://localhost:3000');
    var post_actions = new PostActions();

     $("#board").contextMenu({
     	menu: "boardMenu"
     },
     function(action, el, pos) {
	 switch(action){
	 case 'add':
	        $('#newpostModal').modal('show');
	     break;
	 case 'delete':
	     alert ('delete');
	     break;
	 }		     
     });

    post_actions.init(socket);
    post_actions.contextMenu_post();
    post_actions.drag_post();
    
  
    socket.on('create post', function (data) {
	post_actions.create_post_div(data);
    });

     socket.on('change post position', function (data) {
	 $('.post-it[rel='+data._id+']').attr('style', data.position);
     });

    socket.on('delete post', function (data) {
	$('.post-it[rel='+data._id+']').remove();
    });
   
         
});




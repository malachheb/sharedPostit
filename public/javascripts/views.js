$(document).ready(function() {
    var socket = io.connect('http://localhost:5000');
    var post_actions = new PostActions();

    	$('#go').live("click", function() {
	    post_actions.start_session();
	    $.ajax({
                url: '/start',
                type: 'POST',
                data: $('form#start').serialize(),
                success: function(data) {
		    $('body').html(data);
		    $("#board").contextMenu({
     			menu: "boardMenu"
		    },function(action, el, pos) {
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
                },
	     	error: function() {
	     	    console.log('process error');
	     	}
            });
	    
	});
    
    socket.on('new user', function (data) {
	post_actions.create_user_div(data);
    });

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




      // <% for(var i=0; i<users.length; i++) { %>
      // 	<div id="myuser">
      // 	  <div id="myswatchbox" class="myswatchboxhoverable">
      //       <div id="myswatch" style="background-image: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: rgb(255, 227, 143); background-position: initial initial; background-repeat: initial initial; "></div>
      // 	  </div>
      //     <div id="myusernameform">
      // 	    <div id="username"><%= users[i].pseudo %> </div>
      // 	  </div>
      // 	</div>
      //  <% } %>	


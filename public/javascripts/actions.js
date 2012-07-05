

function PostActions()
{
    var socket = null;
    PostActions.prototype.init = function(mysocket) {
	var me = this;
	me.socket = mysocket;
	$('#newpost').submit(function() {
	    me.create_post();
	    $('#newpostModal').modal('hide');
	    return false;
	});

	$('#go').live("click", function() {
	    me.start_session();
	    $.ajax({
                url: '/start',
                type: 'POST',
                data: $('form#start').serialize(),
                success: function(data) {
	     	    $('body').html(data);
                },
	     	error: function() {
	     	    console.log('process error');
	     	}
            });
	    
	});
    }

    PostActions
    
    PostActions.prototype.create_post_div = function (data) {
	var me = this;
	html_post = 	'<div class="post-it" id="post" style="'+data.position+'" rel="'+data._id+'">'+
   	    '<h1>'+data.title+'</h1>'+
            '<ul>'+
	    '<li>* '+ data.content+' </li>'+
    	    '</ul>'+
	    '</div>';
	$('div#board').append(html_post);
	me.drag_post();
    }

    PostActions.prototype.create_user_div = function (data){
	var me = this;
	html_user =   '	<div id="myuser">'+
	    '<div id="myswatchbox" class="myswatchboxhoverable">'+
            '<div id="myswatch" style="background-image: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: rgb(255, 227, 143); background-position: initial initial; background-repeat: initial initial; "></div>'+
	    '</div>'+
	    '<div id="myusernameform">'+
	    '<div id="username">'+data.pseudo+'</div>'+
	    '</div>'+
	    '</div>';
	    $('div#userContent').append(html_user);
    }


    PostActions.prototype.change_position = function (id, style){
	var me = this;
	$.ajax({
            url: "/post/edit/"+id,
            type: "PUT",
            data: {
		position: style
	    },
	    success: function(data) {
		me.socket.emit('change post position', data);
		console.log('process sucess');
	    },
	    error: function() {
		console.log('process error');
	    }
	});
	
    }
    
    PostActions.prototype.create_post = function()
    {
	var me = this;
	$.ajax({
            url: "/post/new",
            type: "POST",
	    data: $("#newpost").serialize(),
	    success: function(data) {
		me.create_post_div(data); 
		me.contextMenu_post();
		me.socket.emit('new post', data);
		console.log(data.user);
		console.log('process sucess');
	    },
	    error: function() {
		console.log('process error');
	    }
	});
	
    }

    PostActions.prototype.start_session = function()
    {
	var me = this;
	$.ajax({
            url: "/new",
            type: "POST",
	    data: $("#start").serialize(),
	    success: function(data) {
//		$('#start').submit();
		me.socket.emit('new user', data);
		console.log("new user success"+ data);
	    },
	    error: function() {
		console.log('process error');
		return false;
	    }
	});
    }


    PostActions.prototype.delete_post = function (id){
	var me = this;
	$.ajax({
            url: "/post/delete/"+id,
            type: "DELETE",
            success: function(data) {
		$('div#board').find( '.post-it[rel='+id+']').remove();
		me.socket.emit('delete post', data);
		console.log('process sucess');
	    },
	    error: function() {
		console.log('process error');
	    }
	});
	
     }


    PostActions.prototype.drag_post = function()
    {
	var me = this;
	$(".post-it" ).draggable({
	    containment: "parent",
	    stop: function(event, ui) {
		var style = $(this).attr("style");
		var id = $(this).attr("rel");
		me.change_position(id, style);
	    }
	});

    }


    PostActions.prototype.contextMenu_post = function()
    {

	var me = this;
	$(".post-it").contextMenu({
     	    menu: "postMenu"
	},
        function(action, el, pos) {
	    switch(action){
	    case 'edit':
		alert ('edit');
		break;
	    case 'delete':
		me.delete_post($(el).attr("rel"));
		break;
	    }
	});

    }
    

}
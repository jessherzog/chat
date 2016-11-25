var socket = io();

// ==== WELCOME MSG ==== //
//client listens for welcome message, 
//inputs sent welcomeDataObj as 'data' within new function
socket.on('welcome msg', function(w_data){
	$('#msgs').append($('<li>').text(w_data.message));
	showHIST(w_data.chatlog);
})

// ==== USERNAME + CHAT MSG ==== //
var usr = "";

function sendMSG() {
	$('#cust').on('click', function(){
	    var username = prompt("create a username", "");
		if (username != "") {
	        usr = username;
	    } else {
	    	usr = "User" + socket.conn.server.clientsCount;
	    }
	})
	var msg_data = {
		'usr'	: usr,
		'msg'	: $('#m').val()
	}
	socket.emit('send msg', msg_data)
	$('#m').val('');	
	return false;
};

$('form').submit(sendMSG);

socket.on('latest msg', function(data){
	$('#msgs').append($('<li>').text(data));
});

// ==== HISTORY ==== //
$('#hist').on('click', function(){
	socket.emit('get full history');
}); 

var showHIST = function(chatlog){
	for (var i = 0; i < chatlog.length; i++){
		var namespace = chatlog[i].user;
		var existingMsgs = namespace + ": " + chatlog[i].message;
		$('#msgs').append($('<li>').text(existingMsgs));	
	}
}

socket.on('full history log', function(data){
	showHIST(data.chatlog);
});
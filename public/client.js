var socket = io();

var usr = "";

// ==== WELCOME MSG ==== //
//client listens for welcome message, 
//inputs sent welcomeDataObj as 'data' within new function
socket.on('welcome msg', function(w_data){
	$('#msgs').append($('<li>').text(w_data.message));
	usr = w_data.curr_user;
	showHIST(w_data);
})

// ==== USERNAME + CHAT MSG ==== //
$('#cust').on('click', function(){
    var usr = prompt("create a username", "");
})

function sendMSG() {
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

var showHIST = function(data){
	for (var i = 0; i < data.length; i++){
		var existingMsgs = data[i].message;
		$('#msgs').append($('<li>').text(existingMsgs));	
	}
}

socket.on('full history log', function(data){
	showHIST(data);
});
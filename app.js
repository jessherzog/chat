var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = 9000;

var chatlog = [];

function mainReqHand(req, res){	
	res.sendFile(__dirname + '/public/index.html');
}
app.use('/', express.static(__dirname + "/public"));
function portCallback(){
	console.log('gotchu on ' + port);
}
function incomingSockHand(socket){
	// create an object, host on server.
	var genericUser = "User" + socket.conn.server.clientsCount;
	var currUser;

	var welcome = {
		'message'	: 'Welcome, ' + genericUser + '!',
		'chatlog'	:  chatlog.slice(-5),
		'curr_user'	:  genericUser
	} 
	// send to the client using connecting variable, and what is being sent.
	socket.emit('welcome msg', welcome);

	var message;

	socket.on('send msg', function(m_data){
		if (currUser != ""){
			currUser = m_data.usr;
		} else {
			currUser = genericUser;
		}

	    var chatstuff = {
	    	'username'	: currUser,
	    	'message'	: m_data.msg
	    }
	    var chatline = chatstuff.username + ": " + chatstuff.message;			
		chatlog.push(chatline);
		
		io.emit('latest msg', chatline);
	});

	socket.on('get full history', function(){
		var chat_hist = {
			'chat_user' : currUser,
			'chatlog'	: chatlog
		}
		socket.emit('full history log', chatlog);
	});
}

io.on('connection', incomingSockHand);
server.listen(process.env.port || port, portCallback);
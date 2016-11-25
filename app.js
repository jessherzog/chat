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
	var welcome = {
		'message'	: 'Welcome!',
		'chatlog'	:  chatlog.slice(-5)
	} 
	// send to the client using connecting variable, and what is being sent.
	socket.emit('welcome msg', welcome);

	var message;

	socket.on('send msg', function(m_data){
	    var chatstuff = {
	    	'username'	: m_data.usr,
	    	'message'	: m_data.msg
	    }
	    var chatline = chatstuff.username + ": " + chatstuff.message;			
		chatlog.push(chatline);
		
		io.emit('latest msg', chatline);
	});

	socket.on('get full history', function(){
		var chat_hist = {
			'chatlog'	: chatlog
		}
		console.log(chat_hist);
		socket.emit('full history log', chat_hist.chatlog);
	});
}

io.on('connection', incomingSockHand);
server.listen(process.env.port || port, portCallback);
var PORT = process.env.PORT ||3000;
var express = require('express');
var moment = require('moment');
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

//for current users in the socket
function sendCurrentUsers(socket){
	var info = clientInfo[socket.id];
	var users = [];

	if(typeof info === 'undefined'){
		return;
	}
	Object.keys(clientInfo).forEach(function(socketId){
		var userInfo = clientInfo[socketId];

		if(info.room === userInfo.room){
			users.push(userInfo.name);
		}
	});
	socket.emit('message',{
		name: "System",
		text: "current users: " + users.join(', '),
		timestamp: moment().valueOf()
	});
}

io.on('connection', function(socket) {
	console.log('user connected via socket.io!');
	
	socket.on('disconnect', function(){
		var userData = clientInfo[socket.id];
		if(typeof userData !== 'undefined'){
			socket.leave(userData.room);
			io.to(userData.room).emit('message',{
				name: 'Syatem',
				text: userData.name + ' has left!!',
				timestamp: moment().valueOf()	
			});
			delete clientInfo[socket.id];
		}

	});

	socket.on('join room', function(req){
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message',{
			name:"System",
			text: req.name + " has joined!!",
			timestamp: moment().valueOf()	
		});
	})

	socket.on('message', function(message) {
		console.log('Message received ' +message.text);

		if(message.text === '@currentUsers'){
			sendCurrentUsers(socket);
		} else {
			message.timestamp = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message',message)	
		}
	});

	socket.emit('message', {
		name: "System" ,
		text: '<strong>' + 'Welcome to the chatting' + '</strong>',
		timestamp: moment().valueOf()
	});
});

http.listen(PORT,function() {
	console.log('server started');
});
var name = getQueryVariable('name');
var room = getQueryVariable('room');
var socket = io();

jQuery('.room-title').text(room);

socket.on('connect', function() {
	console.log('connected to socket');
	socket.emit('join room',{
		name: name,
		room: room
	});
});

socket.on('message', function(message) {
	var momentTimeStamp = moment.utc(message.timestamp);
	var $msg = jQuery('.messages');
	console.log('New message');
	console.log(message.text);

	$msg.append('<p><strong>'+ message.name + ' ' + momentTimeStamp.local().format('h:mm a') +' </strog> </p>')
	$msg.append('<p>' + message.text +'</p>');
	//jQuery('.messages').append('<p><strong>' + momentTimeStamp.local().format('h:mm a') + '  ' + '<strong>' + message.text +'</p>');
});

//Handles new msg submitting

var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');

	socket.emit('message', {
		name: name,
		text: $message.val()
	});

	$message.val('');

});

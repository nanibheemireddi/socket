var socket = io();

socket.on('connect', function() {
	console.log('connected to socket');
});

socket.on('message', function(message) {
	var momentTimeStamp = moment.utc(message.timestamp);
	console.log('New message');
	console.log(message.text);

	jQuery('.messages').append('<p><strong>' + momentTimeStamp.local().format('h:mm a') + '<strong>' +  " " + message.text +'</p>');
});

//Handles new msg submitting

var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');

	socket.emit('message', {
		text: $message.val()
	});

	$message.val('');

});

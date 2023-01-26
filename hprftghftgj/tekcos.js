var socket = 0;

module.exports.initiate = (socketio) => {
	socket = socketio;
}

module.exports.on = (method, message) => {
	console.log("-------------------> ~ message", message)
	console.log(method, "method")
	return message
}
module.exports.onnn = (method) => {
	console.log(method, "method")
	socket.sockets.on(method, (newMessage) => {
		console.log('Message', newMessage);

		return newMessage

	})

}



module.exports.sendmessage = (method, message) => {
	socket.sockets.emit(method, message)
}

module.exports.send_trade_response = (method, message) => {
	socket.sockets.to(message.pair.replace("/", "_")).emit(method, message)
}
var socketio = require('socket.io');


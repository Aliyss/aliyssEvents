const converter = require('./../aliyssConverter/converterInput')
const commandInput = require("../aliyssCommands/commandInput");

exports.events = (_instance) => {
	let client = _instance.client;

	client.on('qr', qr => {
		
	})
	
	client.on('authenticated', _instance.saveAuth)
	
	client.on('message_create', msg => {
		let message = converter.message(msg, _instance)
		commandInput.command(message, _instance)
	})

	client.on('message', msg => {
		let message = converter.message(msg, _instance)
		commandInput.command(message, _instance)
	});

	client.on('text', msg => {
		console.log(msg)
	});
	
	_instance.disableEvents();
}
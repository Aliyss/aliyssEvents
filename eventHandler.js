const converter = require('./../aliyssConverter/converterInput')

exports.events = (_instance) => {
	let client = _instance.client;

	client.on('qr', qr => {
		
	})
	
	client.on('authenticated', _instance.saveAuth)
	
	client.on('message_create', msg => {
		converter.message(msg, _instance)
	})

	client.on('message', msg => {
		converter.message(msg, _instance)
	});

	client.on('text', msg => {
		console.log(msg)
	});
	
	_instance.disableEvents();
}
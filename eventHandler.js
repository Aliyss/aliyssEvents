const converter = require('./../aliyssConverter/converterInput')
const commandInput = require("../aliyssCommands/commandInput");

exports.events = (_instance) => {
	let client = _instance.client;

	client.on('qr', qr => {
		
	})
	
	client.on('authenticated', _instance.saveAuth)
	
	client.on('message_create', async msg => {
		await messageControl(msg, _instance)
	})

	client.on('message', async msg => {
		await messageControl(msg, _instance)
	});

	client.on('text', msg => {
		console.log(msg)
	});
	
	_instance.disableEvents();
}

const messageControl = async (msg, _instance) => {
	let command = await converter.command(msg, _instance)
	let returnMessage = await commandInput.command(command, _instance)
	if (!command.isCommand) {
		return;
	}
	if (!returnMessage) {
		console.log(`[${_instance.id}] Error: ${msg}`)
		return;
	}
	let cmdMessage = converter.convertDefault(returnMessage, _instance)
	let logMessage = await command.send(cmdMessage);
	if (!logMessage) {
		console.log(`[${_instance.id}] Error: ${msg}`)
		return;
	}
	console.log(`[${_instance.id}] Response: ${logMessage.id}`)
}
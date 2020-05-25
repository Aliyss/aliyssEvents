const converter = require('./../aliyssConverter/converterInput')
const commandInput = require("../aliyssCommands/commandInput");

exports.events = (_instance) => {
	let client = _instance.client;
	
	if (client.on) {
		client.on('qr', qr => {

		})

		client.on('authenticated', _instance.saveAuth)

		client.on('message_create', async msg => {
			await messageControl(msg, _instance, 'message')
		})

		client.on('message', async msg => {
			await messageControl(msg, _instance, 'message')
		});

		client.on('messageReactionAdd', async msg => {
			await messageControl(msg, _instance, 'reaction')
		});

		client.on('text', msg => {
			console.log(msg)
		});
	}
	
	_instance.disableEvents();
}

const messageControl = async (msg, _instance, type) => {
	let command = await converter.command(msg, _instance, type)
	if (
		!command.isPrefixed
		&& (
			!command.layout.nlp ||
			(!command.layout.nlp.no_prefix && !command.layout.nlp.on_command)
		)) {
		return;
	}
	let returnMessage = await commandInput.command(command, _instance)
	if (!returnMessage) {
		return;
	} else if (returnMessage.error) {
		console.log(`[${_instance.id}] Error: ${returnMessage.error}`)
		return;
	}
	let cmdMessage = converter.convertDefault(returnMessage, _instance, command)
	if (!cmdMessage) {
		return;
	}
	let logMessage;
	try {
		logMessage = await converter.command(await command.send(cmdMessage), _instance)
	} catch (e) {
		console.log(e)
	}
	
	if (!logMessage || !logMessage.id) {
		return;
	}
	_instance.logs.push(logMessage.id)
	if (!logMessage) {
		console.log(`[${_instance.id}] Error: ${msg}`)
		return;
	}
	console.log(`[${_instance.id}] Response: ${logMessage.id}`)
}
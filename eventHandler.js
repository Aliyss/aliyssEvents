const converter = require('./../aliyssConverter/converterInput')
const commandInput = require("../aliyssCommands/commandInput");

exports.events = (_instance) => {
	let client = _instance.client;
	
	if (client.on) {
		client.on('qr', qr => {

		})

		client.on('authenticated', _instance.saveAuth)

		client.on('message_create', async msg => {
			try {
				await messageControl(msg, _instance, 'message')
			} catch (e) {
				console.log(e)
			}
		})

		client.on('message', async msg => {
			try {
				await messageControl(msg, _instance, 'message')
			} catch (e) {
				console.log(e)
			}
		});

		client.on('messageReactionAdd', async msg => {
			try {
				await messageControl(msg, _instance, 'reaction')
			} catch (e) {
				console.log(e)
			}
		});

		client.on('text', msg => {
			console.log(msg)
		});
	}
	
	_instance.disableEvents();
}

const messageControl = async (msg, _instance, type) => {
	let command;
	try {
		command = await converter.command(msg, _instance, type)
	} catch (e) {
		console.error(e)
		return;
	}
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
	let { content, options } = await converter.convertDefault(returnMessage, _instance, command)
	if (!content) {
		return;
	}
	let logMessage;
	try {
		logMessage = await converter.command(await command.send(content, options), _instance)
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
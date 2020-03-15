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
	if (!command.isCommand && _instance.layout.nlp && _instance.layout.nlp.ignore && _instance.layout.nlp.ignore.includes(command.author.id)) {
		return;
	}
	let returnMessage = await commandInput.command(command, _instance)
	if (!command.isCommand && (!_instance.layout.nlp || !_instance.layout.nlp.no_prefix)) {
		return;
	}
	if (!returnMessage || returnMessage.error) {
		console.log(`[${_instance.id}] Error: ${returnMessage.error}`)
		return;
	}
	let cmdMessage = converter.convertDefault(returnMessage, _instance)
	if (!cmdMessage) {
		return;
	}
	let logMessage = await converter.command(await command.send(cmdMessage), _instance)
	_instance.logs.push(logMessage.id)
	if (!logMessage) {
		console.log(`[${_instance.id}] Error: ${msg}`)
		return;
	}
	console.log(`[${_instance.id}] Response: ${logMessage.id}`)
}
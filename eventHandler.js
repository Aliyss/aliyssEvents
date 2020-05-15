const converter = require('./../aliyssConverter/converterInput')
const commandInput = require("../aliyssCommands/commandInput");

exports.events = (_instance) => {
	let client = _instance.client;
	
	if (client.on) {
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
	}
	
	if (client.chat && client.chat.watchAllChannelsForNewMessages) {
		(async () => {

			const onMessage = async message => {
				if (message.content.type !== 'text') {
					return
				}

				if (!message.content.text.body.startsWith('!echo ')) {
					return
				}

				await client.chat.send(message.conversationId, {
					body: message.content.text.body.substr(6),
				})
			}

			const onError = e => console.error(e)
			
			await client.chat.watchAllChannelsForNewMessages(onMessage, onError)
		})();
		
	}
	
	_instance.disableEvents();
}

const messageControl = async (msg, _instance) => {
	let command = await converter.command(msg, _instance)
	if (
		!command.isPrefixed
		&& (
			!command.layout.nlp ||
			(!command.layout.nlp.no_prefix && !command.layout.nlp.on_command)
		)) {
		console.log('NLP is but no prefix')
		return;
	}
	let returnMessage = await commandInput.command(command, _instance)
	if (!returnMessage || returnMessage.error) {
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
		// console.log(e)
	}
	
	if (!logMessage.id) {
		return;
	}
	_instance.logs.push(logMessage.id)
	if (!logMessage) {
		console.log(`[${_instance.id}] Error: ${msg}`)
		return;
	}
	console.log(`[${_instance.id}] Response: ${logMessage.id}`)
}
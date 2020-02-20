

exports.events = (_instance) => {
	let client = _instance.client;

	client.on('qr', qr => {
		
	})
	
	client.on('authenticated', _instance.saveAuth)
}
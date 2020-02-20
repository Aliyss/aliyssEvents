
exports.singleInstance = (_instance) => {
	require("./eventHandler").events(_instance)
}

exports.multiInstances = (_instances) => {
	for (let i = 0; i < _instances.length; i++) {
		require("./eventHandler").events(_instances[i])
	}
}
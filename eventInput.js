
let events = (_instance) => {
	require("./eventHandler").events(_instance)
}

exports.singleInstance = (_instance) => {
	events(_instance)
}

exports.multiInstances = (_instances) => {
	for (let i = 0; i < _instances.length; i++) {
		events(_instances[i])
	}
}
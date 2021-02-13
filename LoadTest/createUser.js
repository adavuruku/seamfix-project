// const loadtest = require('../lib/loadtest.js');
const loadtest = require('loadtest')
const options = {
	url: 'http://localhost:3000',
	concurrency: 5,
	method: 'POST',
	body:{
		"firstName":"Jumai",
		"lastName": "AlHassan",
		"nin": "13121342111"
	},
	requestsPerSecond:5,
	maxSeconds:60,
	requestGenerator: (params, options, client, callback) => {
		options.headers['Content-Type'] = 'application/json';
		options.path = '/api/user/add';
		const request = client(options, callback);
		return request;
	}
};

// try {
// 	let result = loadtest.loadTest(options);
// 	console.log(result)
// } catch (error) {
// 	console.error('Got an error: %s', error);
// }
loadtest.loadTest(options, (error, results) => {
	if (error) {
		return console.error('Got an error: %s', error);
	}
	console.log(results);
	console.log('Tests run successfully');
});
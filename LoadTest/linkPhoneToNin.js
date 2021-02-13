// const loadtest = require('../lib/loadtest.js');

// url: 'http://localhost:3000',
const loadtest = require('loadtest')
const options = {
	url: 'https://seamfix-api.herokuapp.com',
	concurrency: 5,
	method: 'POST',
	body:{
        "nin": "30112221903",
        "phoneNumber":"08123142101"
   },
	requestsPerSecond:5,
	maxSeconds:60,
	requestGenerator: (params, options, client, callback) => {
		options.headers['Content-Type'] = 'application/json';
		options.path = '/api/user/add/phone';
		const request = client(options, callback);
		return request;
	}
};

loadtest.loadTest(options, (error, results) => {
	if (error) {
		return console.error('Got an error: %s', error);
	}
	console.log(results);
	console.log('Tests run successfully');
});
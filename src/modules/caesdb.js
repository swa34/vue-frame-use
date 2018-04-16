/* global XMLHttpRequest */
const json = (url, cb) => {
	const request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.onload = () => {
		if (request.status >= 200 && request.status < 400) {
			cb(null, JSON.parse(request.response));
		} else {
			cb(new Error('HTTP Status ' + request.status));
		}
	};

	request.onerror = () => {
		cb(new Error('Request failed'));
	};

	request.send();
};

const getData = (options, cb) => {
	let url = '/api/' + options.db + '/' + options.table;
	if (options.identifier && options.identifier.key && options.identifier.value) {
		url += '/' + options.identifier.key + '/' + options.identifier.value;
	}
	json(url, cb);
};

const post = (data, cb) => {
	// Doesn't actually post anything, just says it does
	cb(null, { success: true });
};

export default { getData, post };

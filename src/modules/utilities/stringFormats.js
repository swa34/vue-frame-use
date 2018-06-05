const camelCase = (str = '') => {
	return str
		.replace(/-/g, ' ')													// Replace dashes with spaces
		.replace(/\s(.)/g, $1 => $1.toUpperCase())	// Capitalize the first letter after whitespace
		.replace(/\s/g, '')													// Remove whitespace
		.replace(/^(.)/, $1 => $1.toLowerCase());		// Change the first character to lowercase
};

const tableToTitle = str => {
	const arr = str.split('_');
	for (let i = 0; i < arr.length; ++i) {
		arr[i] = arr[i].charAt(0) + arr[i].substring(1).toLowerCase();
		if (i === arr.length - 1) {
			return arr.join(' ');
		}
	}
};

export default { camelCase, tableToTitle };

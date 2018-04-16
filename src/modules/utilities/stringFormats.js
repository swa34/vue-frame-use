const camelCase = (str = '') => {
	return str
		.replace(/\s(.)/g, $1 => $1.toUpperCase())
		.replace(/\s/g, '')
		.replace(/^(.)/, $1 => $1.toLowerCase());
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

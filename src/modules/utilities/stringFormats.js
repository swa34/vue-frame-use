const camelCase = (str) => {
	return str
		.replace(/\s(.)/g, $1 => $1.toUpperCase())
		.replace(/\s/g, '')
		.replace(/^(.)/, $1 => $1.toLowerCase());
};

export default { camelCase };

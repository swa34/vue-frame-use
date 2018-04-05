import formatDates from './formatDates';
import sqlToHtml from './sqlToHtml';
import url from './url';

// Function for prettifying table column names
const getPrettyColumnName = (name) => {
	const replacer = (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	};
	return name.replace(/_/g, ' ').replace(/\w\S*/g, replacer);
};

export {
	formatDates,
	getPrettyColumnName,
	sqlToHtml,
	url
};

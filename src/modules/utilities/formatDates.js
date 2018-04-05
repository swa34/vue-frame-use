import dateFormat from 'dateformat';

const formatDates = (dateFields, records) => {
	if (!Array.isArray(records)) records = [records];
	records.forEach((record) => {
		dateFields.forEach((field) => {
			record[field] = dateFormat(record[field], 'yyyy-mm-dd');
		});
	});
};

export default formatDates;

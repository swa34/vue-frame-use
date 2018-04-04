import dateFormat from 'dateformat';

const htmlDate = (date) => {
	return dateFormat(new Date(date), 'yyyy-mm-dd');
};

export default htmlDate;

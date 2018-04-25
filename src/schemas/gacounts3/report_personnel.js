const schema = {
	database: 'GACOUNTS3',
	table: 'REPORT_PERSONNEL',
	columns: [
		{
			columnName: 'REPORT_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'PERSONNEL_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'IS_REJECTED',
			type: 'bit',
			required: true
		}
	]
};

export default schema;

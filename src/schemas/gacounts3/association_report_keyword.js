const schema = {
	database: 'GACOUNTS3',
	table: 'ASSOCIATION_REPORT_KEYWORD',
	columns: [
		{
			columnName: 'REPORT_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'KEYWORD_ID',
			type: 'int',
			required: true
		}
	]
};

export default schema;

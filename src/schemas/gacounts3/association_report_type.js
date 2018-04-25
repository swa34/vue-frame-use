const schema = {
	database: 'GACOUNTS3',
	table: 'ASSOCIATION_REPORT_TYPE',
	columns: [
		{
			columnName: 'REPORT_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'TYPE_ID',
			type: 'int',
			required: true
		}
	]
};

export default schema;

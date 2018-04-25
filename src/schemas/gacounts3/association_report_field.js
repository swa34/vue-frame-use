const schema = {
	database: 'GACOUNTS3',
	table: 'ASSOCIATION_REPORT_FIELD',
	columns: [
		{
			columnName: 'REPORT_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'FIELD_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'FIELD_VALUE',
			type: 'float',
			required: true
		}
	]
};

export default schema;

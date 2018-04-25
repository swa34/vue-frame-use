const schema = {
	database: 'GACOUNTS3',
	table: 'TARGET_AUDIENCE',
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
		},
		{
			columnName: 'QUANTITY',
			type: 'int',
			required: true
		}
	]
};

export default schema;

const schema = {
	database: 'GACOUNTS3',
	table: 'SUB_REPORT_CONTACT',
	columns: [
		{
			columnName: 'SUB_REPORT_ID',
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

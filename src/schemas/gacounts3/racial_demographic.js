const schema = {
	database: 'GACOUNTS3',
	table: 'RACIAL_DEMOGRAPHIC',
	columns: [
		{
			columnName: 'REPORT_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'RACE_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'GENDER_ID',
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

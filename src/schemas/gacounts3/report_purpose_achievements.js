const schema = {
	database: 'GACOUNTS3',
	table: 'REPORT_PURPOSE_ACHIEVEMENTS',
	columns: [
		{
			columnName: 'ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'REPORT_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'USER_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'MEMO',
			type: 'nvarchar',
			required: true
		},
		{
			columnName: 'DATE_CREATED',
			type: 'datetime',
			required: true
		}
	]
};

export default schema;

const schema = {
	database: 'GACOUNTS3',
	table: 'REPORT_PURPOSE_ACHIEVEMENTS',
	columns: [
		{
			columnName: 'ID',
			type: 'int',
			required: true,
			automated: true
		},
		{
			columnName: 'REPORT_ID',
			prettyName: 'Report',
			type: 'int',
			required: true,
			automated: true
		},
		{
			columnName: 'USER_ID',
			prettyName: 'User',
			type: 'int',
			required: true,
			automated: true
		},
		{
			columnName: 'MEMO',
			type: 'nvarchar',
			inputType: 'textarea',
			required: true
		},
		{
			columnName: 'DATE_CREATED',
			type: 'datetime',
			required: true,
			automated: true
		}
	]
};

export default schema;

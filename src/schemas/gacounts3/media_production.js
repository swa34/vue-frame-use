const schema = {
	database: 'GACOUNTS3',
	table: 'MEDIA_PRODUCTION',
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
			columnName: 'TYPE_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'CITATION',
			type: 'nvarchar',
			required: true
		},
		{
			columnName: 'REVIEW_TYPE_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'STATUS_ID',
			type: 'int',
			required: true
		}
	]
};

export default schema;

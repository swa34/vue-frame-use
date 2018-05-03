const schema = {
	database: 'GACOUNTS3',
	table: 'SUB_REPORT_COMMENT',
	columns: [
		{
			columnName: 'ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'SUB_REPORT_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'USER_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'COMMENT',
			type: 'ntext',
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

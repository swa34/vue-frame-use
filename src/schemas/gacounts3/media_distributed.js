const schema = {
	database: 'GACOUNTS3',
	table: 'MEDIA_DISTRIBUTED',
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
			columnName: 'CATEGORY_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'PRODUCTION_ID',
			type: 'int'
		},
		{
			columnName: 'QUANTITY_UNIQUE_WORKS',
			type: 'int',
			required: true
		},
		{
			columnName: 'CIRCULATION',
			type: 'int'
		},
		{
			columnName: 'INDIRECT_CIRCULATION',
			type: 'int'
		}
	]
};

export default schema;

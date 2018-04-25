const schema = {
	database: 'GACOUNTS3',
	table: 'MEDIA_REVIEW',
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
			type: 'int'
		},
		{
			columnName: 'PRODUCTION_ID',
			type: 'int'
		},
		{
			columnName: 'PUBLICATION_TITLE',
			type: 'nvarchar'
		},
		{
			columnName: 'PUBLICATION_AGENCY',
			type: 'nvarchar'
		},
		{
			columnName: 'PUBLICATION_NUMBER',
			type: 'nvarchar'
		},
		{
			columnName: 'QUANTITY_REVIEWED',
			type: 'int',
			required: true
		}
	]
};

export default schema;

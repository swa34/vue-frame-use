const schema = {
	database: 'GACOUNTS3',
	table: 'REPORT',
	columns: [
		{
			columnName: 'ID',
			type: 'int',
			immutable: true,
			prettyName: 'ID'
		},
		{
			columnName: 'OWNER_ID',
			type: 'int',
			required: true,
			immutable: true
		},
		{
			columnName: 'ACTUAL_SUBMITTER_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'TITLE',
			type: 'nvarchar',
			required: true
		},
		{
			columnName: 'DATE_BEGIN',
			type: 'datetime',
			required: true
		},
		{
			columnName: 'DATE_END',
			type: 'datetime',
			required: true
		},
		{
			columnName: 'COUNTY_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'SCOPE_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'ACTIVITY_LOCATION_TYPE_ID',
			type: 'int'
		},
		{
			columnName: 'ACTIVITY_LOCATION_ALTERNATE_TEXT',
			type: 'nvarchar'
		},
		{
			columnName: 'DATE_CREATED',
			type: 'datetime',
			required: true
		},
		{
			columnName: 'DATE_LAST_UPDATED',
			type: 'datetime',
			required: true
		}
	]
};

export default schema;

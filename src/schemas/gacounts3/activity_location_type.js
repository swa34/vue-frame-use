const schema = {
	database: 'GACOUNTS3',
	table: 'ACTIVITY_LOCATION_TYPE',
	columns: [
		{
			columnName: 'ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'LABEL',
			type: 'nvarchar',
			required: true
		},
		{
			columnName: 'USES_ALTERNATE_TEXT',
			type: 'bit',
			required: true
		}
	]
};

export default schema;

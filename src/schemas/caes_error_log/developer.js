const schema = {
	database: 'CAES_ERROR_LOG',
	table: 'DEVELOPER',
	columns: [
		{
			columnName: 'ID',
			type: 'int',
			prettyName: 'ID',
			immutable: true
		},
		{
			columnName: 'PERSONNEL_ID',
			type: 'int',
			prettyName: 'Personnel ID'
		},
		{
			columnName: 'DATE_CREATED',
			type: 'datetime'
		},
		{
			columnName: 'DATE_LAST_UPDATED',
			type: 'datetime'
		}
	],
	associations: [
		{
			database: 'CAES_ERROR_LOG',
			table: 'ASSOCIATION_DEVELOPER_APPLICATION',
			association: {
				local: 'ID',
				foreign: 'DEVELOPER_ID'
			}
		}
	]
};

export default schema;

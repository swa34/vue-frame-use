const schema = {
	database: 'CAES_ERROR_LOG',
	table: 'APPLICATION',
	columns: [
		{
			columnName: 'ID',
			type: 'int',
			prettyName: 'ID',
			immutable: true
		},
		{
			columnName: 'APPLICATION_NAME',
			type: 'nvarchar'
		},
		{
			columnName: 'BASE_TEMPLATE_PATH',
			type: 'nvarchar'
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
				foreign: 'APPLICATION_ID'
			}
		},
		{
			database: 'CAES_ERROR_LOG',
			table: 'ERROR_REPORT',
			association: {
				local: 'ID',
				foreign: 'APPLICATION_ID'
			}
		}
	]
};

export default schema;

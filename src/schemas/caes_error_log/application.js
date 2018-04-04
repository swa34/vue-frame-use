import associationDeveloperApplicationSchema from '@/schemas/caes_error_log/association_developer_application';
import errorReportSchema from '@/schemas/caes_error_log/error_report';

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
		associationDeveloperApplicationSchema,
		errorReportSchema
	]
};

export default schema;

//	Each object in the schema array represents a column in the table.
//	Current options:
//		'columnName':	required, represents the name of the column
//		'type':	required, the data type of the field
//		'prettyName':	optional, a pretty version of the column name to override the one automatically generated
//		'immutable':	optional, indicate whether the field can be changed or not
const schema = [
	{
		columnName: 'ID',
		type: 'int',
		prettyName: 'ID',
		immutable: true
	},
	{
		columnName: 'APPLICATION_ID',
		type: 'int',
		prettyName: 'Application ID'
	},
	{
		columnName: 'FIXED_DEVELOPMENT',
		type: 'bit'
	},
	{
		columnName: 'FIXED_PRODUCTION',
		type: 'bit'
	},
	{
		columnName: 'DATE_CREATED',
		type: 'datetime'
	},
	{
		columnName: 'DATE_LAST_UPDATED',
		type: 'datetime'
	},
	{
		columnName: 'BROWSER',
		type: 'nvarchar'
	},
	{
		columnName: 'ERROR_DATETIME',
		type: 'datetime'
	},
	{
		columnName: 'DETAIL',
		type: 'nvarchar'
	},
	{
		columnName: 'ERROR_DIAGNOSTICS',
		type: 'nvarchar'
	},
	{
		columnName: 'ERROR_CODE',
		type: 'nvarchar'
	},
	{
		columnName: 'EXTENDED_INFO',
		type: 'nvarchar'
	},
	{
		columnName: 'HTTP_REFERER',
		type: 'nvarchar'
	},
	{
		columnName: 'MAIL_TO',
		type: 'nvarchar'
	},
	{
		columnName: 'MESSAGE',
		type: 'nvarchar'
	},
	{
		columnName: 'NATIVE_ERROR_CODE',
		type: 'nvarchar'
	},
	{
		columnName: 'QUERY_STRING',
		type: 'nvarchar'
	},
	{
		columnName: 'REMOTE_ADDRESS',
		type: 'nvarchar'
	},
	{
		columnName: 'ERROR_SQLSTATE',
		type: 'nvarchar'
	},
	{
		columnName: 'TAG_CONTEXT',
		type: 'nvarchar'
	},
	{
		columnName: 'TEMPLATE',
		type: 'nvarchar'
	},
	{
		columnName: 'TYPE',
		type: 'nvarchar'
	},
	{
		columnName: 'SQL_STATEMENT',
		type: 'nvarchar',
		prettyName: 'SQL Statement'
	},
	{
		columnName: 'SESSION_DUMP',
		type: 'nvarchar'
	},
	{
		columnName: 'URL_DUMP',
		type: 'nvarchar',
		prettyName: 'URL Dump'
	},
	{
		columnName: 'FORM_DUMP',
		type: 'nvarchar'
	},
	{
		columnName: 'CGI_DUMP',
		type: 'nvarchar',
		prettyName: 'CGI Dump'
	},
	{
		columnName: 'APPLICATION_DUMP',
		type: 'nvarchar'
	},
	{
		columnName: 'REQUEST_DUMP',
		type: 'nvarchar'
	}
];

export default schema;

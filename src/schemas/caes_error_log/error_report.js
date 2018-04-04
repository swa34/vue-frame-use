const schema = {
	database: 'CAES_ERROR_LOG',
	table: 'ERROR_REPORT',
	columns: [
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
	],
	associations: [
		{
			database: 'CAES_ERROR_LOG',
			table: 'APPLICATION',
			association: {
				local: 'APPLICATION_ID',
				foreign: 'ID'
			}
		}
	]
};

export default schema;

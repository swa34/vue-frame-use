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
];

export default schema;

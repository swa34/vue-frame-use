//	Each object in the schema array represents a column in the table.
//	Current options:
//		'columnName':	required, represents the name of the column
//		'immutable':	optional, indicate whether the field can be changed or not
//		'prettyName':	optional, a pretty version of the column name to override the one automatically generated
//		'required': optional, indicate whether the field is required or not
//		'type':	required, the data type of the field
const schema = [
	{
		columnName: 'DEVELOPER_ID',
		prettyName: 'Developer ID',
		type: 'int',
		required: true
	},
	{
		columnName: 'APPLICATION_ID',
		prettyName: 'Application ID',
		type: 'int',
		required: true
	},
	{
		columnName: 'DATE_CREATED',
		type: 'datetime',
		immutable: true
	},
	{
		columnName: 'DATE_LAST_UPDATED',
		type: 'datetime',
		immutable: true
	}
];

export default schema;

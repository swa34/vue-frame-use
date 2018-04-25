const schema = {
	database: 'GACOUNTS3',
	table: 'ASSOCIATION_REPORT_TOPIC',
	columns: [
		{
			columnName: 'REPORT_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'TOPIC_ID',
			type: 'int',
			required: true
		}
	]
};

export default schema;

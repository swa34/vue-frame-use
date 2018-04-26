const schema = {
	database: 'GACOUNTS3',
	table: 'ASSOCIATION_REPORT_TOPIC',
	columns: [
		{
			columnName: 'REPORT_ID',
			type: 'int',
			required: true,
			constraint: {
				database: 'GACOUNTS3',
				table: 'REPORT',
				foreignKey: 'ID',
				foreignLabel: 'TITLE',
				values: []
			}
		},
		{
			columnName: 'TOPIC_ID',
			type: 'int',
			required: true,
			constraint: {
				database: 'CAES_CENTRAL_DATABASE',
				table: 'ASSOCIATION_TOPIC_AREA',
				foreignKey: 'TOPIC_ID',
				values: []
			}
		}
	]
};

export default schema;

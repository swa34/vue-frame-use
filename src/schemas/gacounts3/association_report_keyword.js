const schema = {
	database: 'GACOUNTS3',
	table: 'ASSOCIATION_REPORT_KEYWORD',
	columns: [
		{
			columnName: 'REPORT_ID',
			prettyName: 'Report ID',
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
			columnName: 'KEYWORD_ID',
			prettyName: 'Keyword ID',
			type: 'int',
			required: true,
			constraint: {
				database: 'CAES_CENTRAL_DATABASE',
				table: 'KEYWORD',
				foreignKey: 'ID',
				foreignLabel: 'LABEL',
				values: []
			}
		}
	]
};

export default schema;

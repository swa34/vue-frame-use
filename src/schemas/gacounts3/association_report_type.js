const schema = {
	database: 'GACOUNTS3',
	table: 'ASSOCIATION_REPORT_TYPE',
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
			columnName: 'TYPE_ID',
			type: 'int',
			required: true,
			constraint: {
				database: 'GACOUNTS3',
				table: 'REPORT_TYPE',
				foreignKey: 'ID',
				foreignLabel: 'LABEL',
				values: []
			}
		}
	]
};

export default schema;

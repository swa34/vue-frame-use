const schema = {
	database: 'GACOUNTS3',
	table: 'ASSOCIATION_SUB_REPORT_ROLE',
	columns: [
		{
			columnName: 'SUB_REPORT_ID',
			type: 'int',
			required: true,
			constraint: {
				database: 'GACOUNTS3',
				table: 'SUB_REPORT',
				foreignKey: 'ID',
				values: []
			}
		},
		{
			columnName: 'ROLE_ID',
			type: 'int',
			required: true,
			constraint: {
				database: 'GACOUNTS3',
				table: 'SUB_REPORT_ROLE',
				foreignKey: 'ID',
				foreignLabel: 'LABEL',
				values: []
			}
		}
	]
};

export default schema;

const schema = {
	database: 'GACOUNTS3',
	table: 'ASSOCIATION_REPORT_PROGRAM_AREA',
	columns: [
		{
			columnName: 'REPORT_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'AREA_ID',
			type: 'int',
			required: true
		}
	]
};

export default schema;

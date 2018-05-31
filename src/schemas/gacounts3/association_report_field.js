import {
	getReportFields
} from '@/modules/caesdb';

const schema = {
	database: 'GACOUNTS3',
	table: 'ASSOCIATION_REPORT_FIELD',
	columns: [
		{
			columnName: 'REPORT_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'FIELD_ID',
			prettyName: 'Field',
			type: 'int',
			required: true,
			constraint: {
				getValues: getReportFields,
				foreignKey: 'ID',
				foreignLabel: 'LABEL'
			}
		},
		{
			columnName: 'FIELD_VALUE',
			prettyName: 'Value',
			type: 'float',
			required: true,
			min: 0
		}
	]
};

schema.columns.forEach((column) => {
	if (column.constraint) column.constraint.values = [];
});

export default schema;

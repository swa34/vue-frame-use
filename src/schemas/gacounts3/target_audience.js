import {
	getReportTargetAudience,
	getTargetAudiences
} from '@/modules/caesdb';

const schema = {
	title: 'Report Target Audiences',
	tablePrefix: 'GC3_TARGET_AUDIENCE',
	criteria: {
		string: 'critieria_REPORT_ID_eq'
	},
	fetchExisting: getReportTargetAudience,
	columns: [
		{
			columnName: 'REPORT_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'TYPE_ID',
			prettyName: 'Type',
			type: 'int',
			required: true,
			constraint: {
				getValues: getTargetAudiences,
				foreignKey: 'ID',
				foreignLabel: 'LABEL'
			}
		},
		{
			columnName: 'QUANTITY',
			type: 'int',
			required: true,
			min: 0
		}
	]
};

schema.columns.forEach((column) => {
	if (column.constraint) column.constraint.values = [];
});

export default schema;

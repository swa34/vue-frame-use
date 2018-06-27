import {
	getGenders,
	getRaces,
	getRacialDemographic
} from '@/modules/caesdb';

const schema = {
	title: 'Report Racial Demographics',
	tablePrefix: 'GC3_RACIAL_DEMOGRAPHIC',
	criteria: {
		string: 'criteria_REPORT_ID_eq'
	},
	fetchExisting: getRacialDemographic,
	columns: [
		{
			columnName: 'REPORT_ID',
			prettyName: 'Report',
			type: 'int',
			required: true,
			automated: true
		},
		{
			columnName: 'RACE_ID',
			prettyName: 'Race',
			type: 'int',
			required: true,
			constraint: {
				getValues: getRaces,
				foreignKey: 'ID',
				foreignLabel: 'LABEL'
			}
		},
		{
			columnName: 'GENDER_ID',
			type: 'int',
			required: true,
			constraint: {
				getValues: getGenders,
				foreignKey: 'ID',
				foreignLabel: 'LABEL'
			}
		},
		{
			columnName: 'QUANTITY',
			type: 'int',
			required: true
		}
	]
};

schema.columns.forEach((column) => {
	if (column.constraint) column.constraint.values = [];
});

export default schema;

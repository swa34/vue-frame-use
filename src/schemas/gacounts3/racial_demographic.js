import {
	getGenders,
	getRaces
} from '@/modules/caesdb';

const schema = {
	database: 'GACOUNTS3',
	table: 'RACIAL_DEMOGRAPHIC',
	columns: [
		{
			columnName: 'REPORT_ID',
			prettyName: 'Report',
			type: 'int',
			required: true
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

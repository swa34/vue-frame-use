import {
	getEthnicities,
	getGenders
} from '@/modules/caesdb';
import { enableConstraintValues } from '@/modules/schemaTools';

const schema = {
	database: 'GACOUNTS3',
	table: 'ETHNIC_DEMOGRAPHIC',
	columns: [
		{
			columnName: 'REPORT_ID',
			prettyName: 'Report ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'ETHNICITY_ID',
			prettyName: 'Ethnicity',
			type: 'int',
			required: true,
			constraint: {
				getValues: getEthnicities,
				foreignKey: 'ID',
				foreignLabel: 'LABEL'
			}
		},
		{
			columnName: 'GENDER_ID',
			prettyName: 'Gender',
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
			required: true,
			min: 0
		}
	]
};

export default enableConstraintValues(schema);

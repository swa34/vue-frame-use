import {
	getEthnicDemographic,
	getEthnicities,
	getGenders
} from '@/modules/caesdb';
import { enableConstraintValues } from '@/modules/schemaTools';

const schema = {
	title: 'Report Ethnicity Demographics',
	tablePrefix: 'GC3_ETHNIC_DEMOGRAPHIC',
	criteria: {
		string: 'criteria_REPORT_ID_eq'
	},
	fetchExisting: getEthnicDemographic,
	columns: [
		{
			columnName: 'REPORT_ID',
			prettyName: 'Report ID',
			type: 'int',
			required: true,
			automated: true
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

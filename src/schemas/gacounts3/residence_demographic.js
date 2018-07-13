import {
	getResidenceDemographic,
	getResidenceTypes
} from '@/modules/caesdb';
import { enableConstraintValues } from '@/modules/schemaTools';

const schema = {
	title: 'Residence Demographics',
	tablePrefix: 'GC3_RESIDENCE_DEMOGRAPHIC',
	criteria: {
		string: 'criteria_REPORT_ID_eq'
	},
	fetchExisting: getResidenceDemographic,
	columns: [
		{
			columnName: 'REPORT_ID',
			prettyName: 'Report',
			type: 'int',
			required: true,
			automated: true
		},
		{
			columnName: 'TYPE_ID',
			prettyName: 'Residence Type',
			type: 'int',
			required: true,
			constraint: {
				getValues: getResidenceTypes,
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

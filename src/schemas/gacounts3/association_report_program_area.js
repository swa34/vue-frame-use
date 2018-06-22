import {
	getAssociationReportProgramArea,
	getProgramAreas
} from '@/modules/caesdb';

const schema = {
	title: 'Report Program Areas',
	tablePrefix: 'GC3_ASSOCIATION_REPORT_PROGRAM_AREA',
	criteria: {
		string: 'criteria_ID_eq'
	},
	fetchExisting: getAssociationReportProgramArea,
	columns: [
		{
			columnName: 'REPORT_ID',
			type: 'int',
			required: true,
			constraint: {
				database: 'GACOUNTS3',
				table: 'REPORT',
				foreignKey: 'ID',
				values: []
			}
		},
		{
			columnName: 'AREA_ID',
			type: 'int',
			required: true,
			constraint: {
				getValues: getProgramAreas,
				database: 'CAES_CENTRAL_DATABASE',
				table: 'PROGRAM_AREA',
				foreignKey: 'ID',
				foreignLabel: 'LABEL',
				values: []
			}
		}
	]
};

export default schema;

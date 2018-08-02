/* global caesCache */

import {
	getAssociationReportProgramArea
	// getProgramAreas
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
				foreignKey: 'ID',
				values: []
			}
		},
		{
			columnName: 'AREA_ID',
			type: 'int',
			required: true,
			constraint: {
				// getValues: getProgramAreas,
				foreignKey: 'ID',
				foreignLabel: 'ABBREVIATION',
				values: caesCache.data.ccd.programArea
			}
		}
	]
};

export default schema;

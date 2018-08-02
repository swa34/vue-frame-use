/* global caesCache */

import { enableConstraintValues } from '@/modules/schemaTools';
import {
	getReportTargetAudience
	// getTargetAudiences
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
			required: true,
			automated: true
		},
		{
			columnName: 'TYPE_ID',
			prettyName: 'Type',
			type: 'int',
			required: true,
			constraint: {
				// getValues: getTargetAudiences,
				foreignKey: 'ID',
				foreignLabel: 'LABEL',
				values: caesCache.data.ccd.targetAudienceType
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

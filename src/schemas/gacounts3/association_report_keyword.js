/* global caesCache */

import {
	getAssociationReportKeyword
	// getKeywords
} from '@/modules/caesdb';

const schema = {
	title: 'Report Keyword Associations',
	tablePrefix: 'GC3_ASSOCIATION_REPORT_KEYWORD',
	criteria: {
		string: 'criteria_ID_eq'
	},
	fetchExisting: getAssociationReportKeyword,
	columns: [
		{
			columnName: 'REPORT_ID',
			prettyName: 'Report',
			type: 'int',
			required: true,
			constraint: {
				foreignKey: 'ID',
				foreignLabel: 'TITLE',
				values: []
			}
		},
		{
			columnName: 'KEYWORD_ID',
			prettyName: 'Keyword',
			type: 'int',
			required: true,
			constraint: {
				// getValues: getKeywords,
				foreignKey: 'ID',
				foreignLabel: 'LABEL',
				values: caesCache.data.ccd.keyword
			}
		}
	]
};

export default schema;

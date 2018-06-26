import {
	getAssociationReportKeyword,
	getKeywords
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
			prettyName: 'Report ID',
			type: 'int',
			required: true,
			constraint: {
				database: 'GACOUNTS3',
				table: 'REPORT',
				foreignKey: 'ID',
				foreignLabel: 'TITLE',
				values: []
			}
		},
		{
			columnName: 'KEYWORD_ID',
			prettyName: 'Keyword ID',
			type: 'int',
			required: true,
			constraint: {
				getValues: getKeywords,
				database: 'CAES_CENTRAL_DATABASE',
				table: 'KEYWORD',
				foreignKey: 'ID',
				foreignLabel: 'LABEL',
				values: []
			}
		}
	]
};

export default schema;

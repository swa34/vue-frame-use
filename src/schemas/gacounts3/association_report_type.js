import {
	getAssociationReportType,
	getReportTypes
} from '@/modules/caesdb';

const schema = {
	title: 'Report Type Associations',
	tablePrefix: 'GC3_ASSOCIATION_REPORT_TYPE',
	criteria: {
		string: 'criteria_ID_eq'
	},
	fetchExisting: getAssociationReportType,
	columns: [
		{
			columnName: 'REPORT_ID',
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
			columnName: 'TYPE_ID',
			type: 'int',
			required: true,
			constraint: {
				getValues: getReportTypes,
				database: 'GACOUNTS3',
				table: 'REPORT_TYPE',
				foreignKey: 'ID',
				foreignLabel: 'LABEL',
				values: []
			}
		}
	]
};

export default schema;

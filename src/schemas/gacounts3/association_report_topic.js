import {
	getAssociationReportTopic,
	getAssociationTopicArea
} from '@/modules/caesdb';

const schema = {
	title: 'Report Topics',
	tablePrefix: 'GC3_ASSOCIATION_REPORT_TOPIC',
	criteria: {
		string: 'criteria_ID_eq'
	},
	fetchExisting: getAssociationReportTopic,
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
			columnName: 'TOPIC_ID',
			type: 'int',
			required: true,
			constraint: {
				getValues: getAssociationTopicArea,
				database: 'CAES_CENTRAL_DATABASE',
				table: 'ASSOCIATION_TOPIC_AREA',
				foreignKey: 'TOPIC_ID',
				foreignLabel: 'TOPIC_LABEL',
				values: []
			}
		}
	]
};

export default schema;

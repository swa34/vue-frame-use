import {
	getAssociationTopicArea
} from '@/modules/caesdb';

const schema = {
	database: 'GACOUNTS3',
	table: 'ASSOCIATION_REPORT_TOPIC',
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

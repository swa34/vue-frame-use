import {
	getMediaDistributed,
	getMediaTypeCategory
} from '@/modules/caesdb';
import { enableConstraintValues } from '@/modules/schemaTools';

const schema = {
	title: 'Media Distributed',
	tablePrefix: 'GC3_MEDIA_DISTRIBUTED',
	criteria: {
		string: 'criteria_ID_eq'
	},
	fetchExisting: getMediaDistributed,
	columns: [
		{
			columnName: 'ID',
			prettyName: 'Media Distributed',
			type: 'int',
			required: true,
			automated: true
		},
		{
			columnName: 'REPORT_ID',
			prettyName: 'Report',
			type: 'int',
			required: true,
			automated: true
		},
		{
			columnName: 'CATEGORY_ID',
			prettyName: 'Category',
			type: 'int',
			required: true,
			constraint: {
				getValues: getMediaTypeCategory,
				foreignKey: 'ID',
				foreignLabel: 'LABEL'
			}
		},
		{
			columnName: 'PRODUCTION_ID',
			type: 'int',
			automated: true
		},
		{
			columnName: 'QUANTITY_UNIQUE_WORKS',
			type: 'int',
			required: true
		},
		{
			columnName: 'CIRCULATION',
			prettyName: 'Direct Engagement',
			type: 'int'
		},
		{
			columnName: 'INDIRECT_CIRCULATION',
			prettyName: 'Circulation',
			type: 'int'
		}
	]
};

export default enableConstraintValues(schema);

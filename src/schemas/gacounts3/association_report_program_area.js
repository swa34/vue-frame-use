import {
	getProgramAreas
} from '@/modules/caesdb';

const schema = {
	database: 'GACOUNTS3',
	table: 'ASSOCIATION_REPORT_PROGRAM_AREA',
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

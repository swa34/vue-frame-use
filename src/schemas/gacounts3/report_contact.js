import {
	getContactTypes
} from '@/modules/caesdb';

const schema = {
	database: 'GACOUNTS3',
	table: 'REPORT_CONTACT',
	columns: [
		{
			columnName: 'REPORT_ID',
			prettyName: 'Report',
			type: 'int',
			immutable: true
			// constraint: {
			// 	database: 'GACOUNTS3',
			// 	table: 'REPORT',
			// 	foreignKey: 'ID',
			// 	foreignLabel: 'TITLE'
			// }
		},
		{
			columnName: 'TYPE_ID',
			prettyName: 'Contact Type',
			type: 'int',
			required: true,
			constraint: {
				getValues: getContactTypes,
				database: 'GACOUNTS3',
				table: 'CONTACT_TYPE',
				foreignKey: 'ID',
				foreignLabel: 'LABEL'
			}
		},
		{
			columnName: 'QUANTITY',
			type: 'int',
			required: true
		}
	]
};

schema.columns.forEach((column) => {
	if (column.constraint) column.constraint.values = [];
});

export default schema;

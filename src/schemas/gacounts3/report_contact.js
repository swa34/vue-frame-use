import {
	getContactTypes,
	getReportContact
} from '@/modules/caesdb';

const schema = {
	title: 'Report Contacts',
	tablePrefix: 'GC3_REPORT_CONTACT',
	criteria: {
		string: 'criteria_ID_eq'
	},
	fetchExisting: getReportContact,
	columns: [
		{
			columnName: 'REPORT_ID',
			prettyName: 'Report',
			type: 'int',
			immutable: true,
			automated: true
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

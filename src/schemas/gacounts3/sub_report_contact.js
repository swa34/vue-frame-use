/* global caesCache */

import { enableConstraintValues } from '@/modules/schemaTools';
import {
	// getContactTypes,
	getSubReportContact
} from '@/modules/caesdb';

const schema = {
	title: 'Sub-Report Contacts',
	tablePrefix: 'GC3_SUB_REPORT_CONTACT',
	criteria: {
		string: 'criteria_SUB_REPORT_ID_eq'
	},
	fetchExisting: getSubReportContact,
	columns: [
		{
			columnName: 'SUB_REPORT_ID',
			prettyName: 'Sub-Report',
			type: 'int',
			immutable: true,
			automated: true
		},
		{
			columnName: 'TYPE_ID',
			prettyName: 'Contact Type',
			type: 'int',
			required: true,
			constraint: {
				// getValues: getContactTypes,
				foreignKey: 'ID',
				foreignLabel: 'LABEL',
				values: caesCache.data.gc3.contactType
			}
		},
		{
			columnName: 'QUANTITY',
			type: 'int',
			required: true
		}
	]
};

export default enableConstraintValues(schema);

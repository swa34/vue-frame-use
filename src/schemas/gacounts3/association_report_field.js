/* global caesCache */

import { enableConstraintValues } from '@/modules/schemaTools';

const schema = {
	database: 'GACOUNTS3',
	table: 'ASSOCIATION_REPORT_FIELD',
	columns: [
		{
			columnName: 'REPORT_ID',
			type: 'int',
			required: true
		},
		{
			columnName: 'FIELD_ID',
			prettyName: 'Field',
			type: 'int',
			required: true,
			constraint: {
				foreignKey: 'ID',
				foreignLabel: 'LABEL',
				values: caesCache.data.gc3.reportField
			}
		},
		{
			columnName: 'FIELD_VALUE',
			prettyName: 'Value',
			type: 'float',
			required: true,
			min: 0
		}
	],
	prepareForSubmit: (records) => {
		let preparedRecords = [];
		records.forEach((record) => {
			let newRecord = Object.assign({}, record);
			if (newRecord.ACTUAL_FIELD_VALUE) {
				newRecord.FIELD_OPTION_LABEL = newRecord.FIELD_VALUE;
				newRecord.FIELD_VALUE = newRecord.ACTUAL_FIELD_VALUE;
				delete newRecord.ACTUAL_FIELD_VALUE;
			}
			preparedRecords.push(newRecord);
		});
		return preparedRecords;
	}
};

export default enableConstraintValues(schema);

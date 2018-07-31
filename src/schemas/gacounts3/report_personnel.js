import {
	getPersonnel,
	getReportPersonnel
} from '@/modules/caesdb';

const schema = {
	title: 'Collaborator',
	tablePrefix: 'GC3_REPORT_PERSONNEL',
	criteria: {
		string: 'criteria_ID_eq'
	},
	fetchExisting: getReportPersonnel,
	columns: [
		{
			columnName: 'REPORT_ID',
			type: 'int',
			required: true,
			automated: true
		},
		{
			columnName: 'PERSONNEL_ID',
			prettyName: 'Personnel',
			type: 'int',
			inputType: 'fuzzyselect',
			required: true,
			constraint: {
				getValues: getPersonnel,
				foreignKey: 'ID',
				generateValue: (personnel) => {
					return {
						key: personnel.ID,
						label: [
							personnel.FIRST_NAME,
							personnel.MIDDLE_NAME,
							personnel.LAST_NAME
						].join(' ')
					};
				},
				values: []
			}
		},
		{
			columnName: 'IS_REJECTED',
			type: 'bit',
			required: true,
			automated: true,
			default: false
		}
	]
};

export default schema;

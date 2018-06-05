import associationSubReportRoleSchema from '@/schemas/gacounts3/association_sub_report_role';

const schema = {
	title: 'Sub-Report',
	database: 'GACOUNTS3',
	table: 'SUB_REPORT',
	columns: [
		{
			columnName: 'ID',
			prettyName: 'ID',
			type: 'int',
			immutable: true,
			automated: true
		},
		{
			columnName: 'USER_ID',
			prettyName: 'User ID',
			type: 'int',
			immutable: true,
			automated: true
		},
		{
			columnName: 'ACTUAL_SUBMITTER_ID',
			prettyName: 'Actual Submitter ID',
			type: 'int',
			immutable: true,
			automated: true
		},
		{
			columnName: 'REPORT_ID',
			prettyName: 'Report ID',
			type: 'int',
			immutable: true,
			automated: true
		},
		{
			columnName: 'STATE_PLANNED_PROGRAM_ID',
			prettyName: 'State Planned Program ID',
			type: 'int'
		},
		{
			columnName: 'PLANNED_PROGRAM_ID',
			prettyName: 'Planned Program ID',
			type: 'int'
		},
		{
			columnName: 'IS_HIGHLIGHTED',
			type: 'bit'
		},
		{
			columnName: 'DATE_CREATED',
			type: 'datetime',
			required: true
		},
		{
			columnName: 'DATE_LAST_UPDATED',
			type: 'datetime',
			required: true
		}
	],
	associations: [
		{
			title: 'Roles',
			schema: associationSubReportRoleSchema,
			localKey: 'ID',
			foreignKey: 'SUB_REPORT_ID',
			associatedColumn: 'ROLE_ID',
			multiSelect: true
		}
		// {
		// 	title: 'Contacts',
		// 	schema: subReportContactSchema,
		// 	localKey: 'ID',
		// 	foreignKey: 'SUB_REPORT_ID',
		// 	associatedColumn
		// }
	]
};

export default schema;

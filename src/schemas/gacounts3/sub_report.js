import associationSubReportRoleSchema from '@/schemas/gacounts3/association_sub_report_role';
import {
	getPlannedPrograms,
	getStatePlannedPrograms
} from '@/modules/caesdb';

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
			columnName: 'PLANNED_PROGRAM_ID',
			prettyName: 'Local Issue',
			type: 'int',
			constraint: {
				getValues: getPlannedPrograms,
				tablePrefix: 'FPW_PLANNED_PROGRAM',
				criteria: {
					string: 'criteria_PersonnelMayFileUnder',
					useUserID: true
				},
				database: 'FederalPOW',
				table: 'PLANNED_PROGRAM',
				foreignKey: 'ID',
				foreignLabel: 'NAME',
				identifier: {
					key: 'USER_ID',
					value: 9307
				},
				values: []
			},
			depends: {
				column: 'ISSUE_TYPE',
				test (val) {
					return val === 'LOCAL';
				}
			}
		},
		{
			columnName: 'STATE_PLANNED_PROGRAM_ID',
			prettyName: 'State Issue',
			type: 'int',
			constraint: {
				getValues: getStatePlannedPrograms,
				foreignKey: 'ID',
				foreignLabel: 'NAME',
				values: []
			},
			depends: {
				column: 'ISSUE_TYPE',
				test (val) {
					return val === 'STATE';
				}
			}
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
		},
		{
			title: 'Contacts',
			localKey: 'ID',
			foreignKey: 'SUB_REPORT_ID',
			associatedColumn: 'TYPE_ID'
		},
		{
			title: 'Supplemental Data'
		},
		{
			title: 'Outcome, Impact, and Achievements'
		}
	]
};

export default schema;

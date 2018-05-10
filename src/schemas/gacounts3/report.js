// Pull in required modules
import {
	associationReportKeywordSchema,
	associationReportProgramAreaSchema,
	associationReportTopicSchema,
	associationReportTypeSchema
} from '@/schemas/gacounts3';
import {
	ccdAssociationKeywordTopicCriteriaStructure
} from '@/criteriaStructures/caes_central_database';

// Gotta fetch activity locations
let activityLocations = [
	{
		ID: 1,
		LABEL: 'Inside Georgia',
		USES_ALTERNATE_TEXT: 0
	},
	{
		ID: 2,
		LABEL: 'Outside Georgia, Inside U.S.',
		USES_ALTERNATE_TEXT: 1
	},
	{
		ID: 3,
		LABEL: 'Outside U.S.',
		USES_ALTERNATE_TEXT: 1
	}
];

const schema = {
	database: 'GACOUNTS3',
	table: 'REPORT',
	columns: [
		{
			columnName: 'ID',
			type: 'int',
			immutable: true,
			prettyName: 'ID',
			automated: true
		},
		{
			columnName: 'OWNER_ID',
			type: 'int',
			required: true,
			automated: true,
			default: 9307,
			constraint: {
				database: 'CAES_CENTRAL_DATABASE',
				table: 'PERSONNEL',
				foreignKey: 'ID',
				values: []
			}
		},
		{
			columnName: 'ACTUAL_SUBMITTER_ID',
			type: 'int',
			required: true,
			automated: true,
			default: 9307,
			constraint: {
				database: 'CAES_CENTRAL_DATABASE',
				table: 'PERSONNEL',
				foreignKey: 'ID',
				values: []
			}
		},
		{
			columnName: 'TITLE',
			type: 'nvarchar',
			required: true
		},
		{
			columnName: 'SCOPE_ID',
			prettyName: 'Geographic Reach of Activity',
			type: 'int',
			required: true,
			constraint: {
				database: 'CAES_CENTRAL_DATABASE',
				table: 'PROGRAM_SCOPE',
				foreignKey: 'ID',
				foreignLabel: 'LABEL',
				values: []
			}
		},
		{
			columnName: 'ACTIVITY_LOCATION_TYPE_ID',
			prettyName: 'Location of Activity',
			type: 'int',
			constraint: {
				database: 'GACOUNTS3',
				table: 'ACTIVITY_LOCATION_TYPE',
				foreignKey: 'ID',
				foreignLabel: 'LABEL',
				values: []
			}
		},
		{
			columnName: 'COUNTY_ID',
			prettyName: 'County',
			type: 'int',
			required: true,
			constraint: {
				database: 'Portal',
				table: 'CountyList',
				foreignKey: 'CountyListID',
				foreignLabel: 'CountyName',
				values: []
			},
			depends: {
				column: 'ACTIVITY_LOCATION_TYPE_ID',
				test (val) {
					const activityLocationMap = activityLocations.map(location => location.ID);
					const activityLocationIndex = activityLocationMap.indexOf(val);
					return activityLocationIndex !== -1 && !activityLocations[activityLocationIndex].USES_ALTERNATE_TEXT;
				}
			}
		},
		{
			columnName: 'ACTIVITY_LOCATION_ALTERNATE_TEXT',
			prettyName: 'Out-of-State Location',
			type: 'nvarchar',
			depends: {
				column: 'ACTIVITY_LOCATION_TYPE_ID',
				test (val) {
					const activityLocationMap = activityLocations.map(location => location.ID);
					const activityLocationIndex = activityLocationMap.indexOf(val);
					return activityLocationIndex !== -1 && activityLocations[activityLocationIndex].USES_ALTERNATE_TEXT;
				}
			}
		},
		{
			columnName: 'DATE_BEGIN',
			prettyName: 'Begin Date',
			type: 'datetime',
			required: true
		},
		{
			columnName: 'DATE_END',
			prettyName: 'End Date',
			type: 'datetime',
			required: true
		},
		{
			columnName: 'ISSUE_TYPE',
			prettyName: 'Type of Issue',
			type: 'nvarchar',
			default: 'LOCAL',
			constraint: {
				values: [
					{
						label: 'Local',
						key: 'LOCAL'
					},
					{
						label: 'State',
						key: 'STATE'
					}
				]
			}
		},
		{
			columnName: 'PLANNED_PROGRAM_ID',
			prettyName: 'Local Issue',
			type: 'int',
			constraint: {
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
				database: 'FederalPOW',
				table: 'STATE_PLANNED_PROGRAM',
				foreignKey: 'ID',
				foreignLabel: 'NAME',
				identifier: {
					key: 'IS_FEDERAL_LEVEL',
					value: {
						column: 'OWNER_ID'
					}
				},
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
			columnName: 'DATE_CREATED',
			type: 'datetime',
			required: true,
			automated: true
		},
		{
			columnName: 'DATE_LAST_UPDATED',
			type: 'datetime',
			required: true,
			automated: true
		}
	],
	associations: [
		{
			title: 'Program Areas',
			schema: associationReportProgramAreaSchema,
			localKey: 'ID',
			foreignKey: 'REPORT_ID',
			associatedColumn: 'AREA_ID',
			multiSelect: true
		},
		{
			title: 'Topics',
			schema: associationReportTopicSchema,
			localKey: 'ID',
			foreignKey: 'REPORT_ID',
			associatedColumn: 'TOPIC_ID',
			multiSelect: true,
			groupBy: 'AREA_ID',
			groupsToShow: {
				association: 'Program Areas',
				column: 'AREA_ID'
			}
		},
		{
			title: 'Report Type',
			schema: associationReportTypeSchema,
			localKey: 'ID',
			foreignKey: 'REPORT_ID',
			associatedColumn: 'TYPE_ID',
			isAssignable: true,
			forbidMultiple: true,
			filter: {
				association: {
					title: 'Program Areas',
					column: 'AREA_ID'
				},
				database: 'GACOUNTS3',
				table: 'ASSOCIATION_REPORT_TYPE_PROGRAM_AREA',
				associatedColumn: 'AREA_ID',
				optionColumn: 'REPORT_TYPE_ID'
			}
		},
		{
			title: 'Keywords',
			schema: associationReportKeywordSchema,
			localKey: 'ID',
			foreignKey: 'REPORT_ID',
			associatedColumn: 'KEYWORD_ID',
			multiSelect: true,
			filter: {
				associations: [
					{
						title: 'Program Areas',
						column: 'AREA_ID'
					},
					{
						title: 'Topics',
						column: 'TOPIC_ID'
					}
				],
				database: 'CAES_CENTRAL_DATABASE',
				table: 'ASSOCIATION_KEYWORD_TOPIC',
				optionColumn: 'KEYWORD_ID',
				criteriaStructure: ccdAssociationKeywordTopicCriteriaStructure
			}
		}
	]
	// subschemas: [
	// 	subReportSchema
	// ]
};

export default schema;

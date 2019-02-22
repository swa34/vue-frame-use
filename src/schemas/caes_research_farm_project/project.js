/* global caesCache */

const schema = {
	title: 'Project',
	columns: [
		{
			columnName: 'ID',
			type: 'int',
			immutable: true,
			automated: true,
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'TITLE',
			type: 'nvarchar',
			required: true,
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'PARTICIPATING_RESEARCH_FARM_ID',
			prettyName: 'Participating Research Farm',
			type: 'int',
			required: true,
			constraint: {
				foreignKey: 'ID',
				foreignLabel: 'NAME',
				values: caesCache.data.crfp.researchFarm
			},
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'START_DATE',
			type: 'datetime',
			required: true,
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'END_DATE',
			type: 'datetime',
			required: true,
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'PI_PERSONNEL_ID',
			type: 'int',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'PI_FIRST_NAME',
			prettyName: 'Principle Investigator First Name',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'PI_MIDDLE_NAME',
			prettyName: 'Principle Investigator Middle Name',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'PI_LAST_NAME',
			prettyName: 'Principle Investigator Last Name',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'PI_EMAIL',
			prettyName: 'Principle Investigator Email',
			type: 'nvarchar',
			inputType: 'email',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'PI_PHONE',
			prettyName: 'Principle Investigator Phone Number',
			type: 'nvarchar',
			inputType: 'tel',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'PI_ADDRESS_1',
			prettyName: 'Principle Investigator Address',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'PI_ADDRESS_2',
			prettyName: 'Principle Investigator Address (Cont.)',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'PI_CITY',
			prettyName: 'Principle Investigator City',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'PI_STATE',
			prettyName: 'Principle Investigator State',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'PI_ZIPCODE',
			prettyName: 'Principle Investigator ZIP Code',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'PI_DEPARTMENT',
			prettyName: 'Principle Investigator Department Name',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'SECONDARY_CONTACT_PERSONNEL_ID',
			prettyName: 'Secondary Contact',
			type: 'int',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'SECONDARY_CONTACT_FIRST_NAME',
			prettyName: 'Secondary Contact First Name',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'SECONDARY_CONTACT_MIDDLE_NAME',
			prettyName: 'Secondary Contact Middle Name',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'SECONDARY_CONTACT_LAST_NAME',
			prettyName: 'Secondary Contact Last Name',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'SECONDARY_CONTACT_EMAIL',
			prettyName: 'Secondary Contact Email',
			type: 'nvarchar',
			inputType: 'email',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'SECONDARY_CONTACT_PHONE',
			prettyName: 'Secondary Contact Phone Number',
			type: 'nvarchar',
			inputType: 'tel',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'SECONDARY_CONTACT_ADDRESS_1',
			prettyName: 'Secondary Contact Address',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'SECONDARY_CONTACT_ADDRESS_2',
			prettyName: 'Secondary Contact Address (Cont.)',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'SECONDARY_CONTACT_CITY',
			prettyName: 'Secondary Contact City',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'SECONDARY_CONTACT_STATE',
			prettyName: 'Secondary Contact State',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'SECONDARY_CONTACT_ZIPCODE',
			prettyName: 'Secondary Contact ZIP Code',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'COMMODITY_ID',
			prettyName: 'Commodity',
			type: 'int',
			constraint: {
				values: caesCache.data.crfp.commodity,
				foreignKey: 'ID',
				foreignLabel: 'LABEL'
			},
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'DISCIPLINE_ID',
			prettyName: 'Discipline',
			type: 'int',
			constraint: {
				values: caesCache.data.crfp.discipline,
				foreignKey: 'ID',
				foreignLabel: 'LABEL'
			},
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'RATIONALE',
			prettyName: 'Justification',
			type: 'nvarchar',
			inputType: 'textarea',
			grouping: {
				section: 'Summary of Project',
				order: 1
			}
		},
		{
			columnName: 'OBJECTIVES_SUMMARY',
			prettyName: 'Objectives',
			type: 'nvarchar',
			inputType: 'textarea',
			grouping: {
				section: 'Summary of Project',
				order: 2
			}
		},
		{
			columnName: 'PLAN_OF_WORK',
			type: 'nvarchar',
			inputType: 'textarea',
			grouping: {
				section: 'Scientist and Station Responsibilities',
				order: 1
			}
		},
		{
			columnName: 'TREATMENT_LIST_ATTACHMENT_PATH',
			prettyName: 'Treatment List',
			type: 'nvarchar',
			grouping: {
				section: 'Scientist and Station Responsibilities',
				order: 1
			}
		},
		{
			columnName: 'PLOT_MAP_ATTACHMENT_PATH',
			prettyName: 'Plot Map',
			type: 'nvarchar',
			grouping: {
				section: 'Scientist and Station Responsibilities',
				order: 1
			}
		},
		{
			columnName: 'CALENDAR_ATTACHMENT_PATH',
			prettyName: 'Calendar',
			type: 'nvarchar',
			grouping: {
				section: 'Scientist and Station Responsibilities',
				order: 1
			}
		},
		{
			columnName: 'INVOLVES_PLANTS',
			prettyName: 'Does this project involve plants?',
			type: 'bit',
			grouping: {
				section: 'Scientist and Station Responsibilities',
				order: 1
			}
		},
		{
			columnName: 'INVOLVES_ANIMALS',
			prettyName: 'Does this project involve animals?',
			type: 'bit',
			grouping: {
				section: 'Scientist and Station Responsibilities',
				order: 1
			}
		},
		{
			columnName: 'SAFETY_REQUIREMENTS',
			prettyName: 'Safety Precautions',
			type: 'nvarchar',
			inputType: 'textarea',
			grouping: {
				section: 'Additional Responsibilities and Funding',
				order: 1
			}
		},
		{
			columnName: 'OTHER_FUNDING_SOURCE',
			prettyName: 'Specify Funding Agency',
			type: 'nvarchar',
			grouping: {
				section: 'Additional Responsibilities and Funding',
				order: 1
			}
		},
		{
			columnName: 'FINANCIAL_SUPPORT_AVAILABLE',
			prettyName: 'Financial Support Available for Project',
			type: 'int',
			grouping: {
				section: 'Additional Responsibilities and Funding',
				order: 1
			}
		},
		{
			columnName: 'STATION_SUPERINTENDENT_PERSONNEL_ID',
			prettyName: 'Station Superintendent',
			type: 'int',
			grouping: {
				section: 'Routing and Approval',
				order: 1
			}
		},
		{
			columnName: 'SUPERINTENDENT_COMMENTS',
			type: 'nvarchar',
			inputType: 'textarea',
			grouping: {
				section: 'Routing and Approval',
				order: 1
			}
		},
		{
			columnName: 'SUPERINTENDENT_APPROVAL_DATE',
			type: 'datetime',
			automated: true,
			grouping: {
				section: 'Routing and Approval',
				order: 1
			}
		},
		{
			columnName: 'DEPARTMENT_HEAD_PERSONNEL_ID',
			prettyName: 'Department Head',
			type: 'int',
			grouping: {
				section: 'Routing and Approval',
				order: 1
			}
		},
		{
			columnName: 'DEPARTMENT_HEAD_COMMENTS',
			type: 'nvarchar',
			inputType: 'textarea',
			grouping: {
				section: 'Routing and Approval',
				order: 1
			}
		},
		{
			columnName: 'DEPARTMENT_HEAD_APPROVAL_DATE',
			type: 'datetime',
			automated: true,
			grouping: {
				section: 'Routing and Approval',
				order: 1
			}
		},
		{
			columnName: 'FINAL_SITE_APPROVER_PERSONNEL_ID',
			prettyName: 'Final Site Approver',
			type: 'int',
			grouping: {
				section: 'Routing and Approval',
				order: 1
			}
		},
		{
			columnName: 'FINAL_SITE_APPROVER_COMMENTS',
			type: 'nvarchar',
			inputType: 'textarea',
			grouping: {
				section: 'Routing and Approval',
				order: 1
			}
		},
		{
			columnName: 'FINAL_SITE_APPROVER_APPROVAL_DATE',
			type: 'datetime',
			automated: true,
			grouping: {
				section: 'Routing and Approval',
				order: 1
			}
		},
		{
			columnName: 'OFFICE_OF_RESEARCH_PERSONNEL_ID',
			prettyName: 'Office of Research',
			type: 'int',
			grouping: {
				section: 'Routing and Approval',
				order: 1
			}
		},
		{
			columnName: 'OFFICE_OF_RESEARCH_COMMENTS',
			type: 'nvarchar',
			inputType: 'textarea',
			grouping: {
				section: 'Routing and Approval',
				order: 1
			}
		},
		{
			columnName: 'OFFICE_OF_RESEARCH_APPROVAL_DATE',
			type: 'datetime',
			automated: true,
			grouping: {
				section: 'Routing and Approval',
				order: 1
			}
		},
		{
			columnName: 'STATUS_ID',
			type: 'int',
			automated: true,
			grouping: {
				section: 'Routing and Approval',
				order: 1
			}
		},
		{
			columnName: 'IS_SUBMITTED',
			type: 'bit',
			automated: true,
			grouping: {
				section: 'Routing and Approval',
				order: 1
			}
		},
		{
			columnName: 'DATE_UPDATED',
			type: 'datetime',
			automated: true,
			grouping: {
				section: 'Routing and Approval',
				order: 1
			}
		}
	],
	associations: [],
	subschemas: [],
	sections: [
		{
			title: 'General Information',
			order: 1
		},
		{
			title: 'Summary of Project',
			order: 2
		},
		{
			title: 'Scientist and Station Responsibilities',
			order: 3
		},
		{
			title: 'Additional Responsibilities and Funding',
			order: 4
		},
		{
			title: 'Routing and Approval',
			order: 5
		}
	]
};

export default schema;

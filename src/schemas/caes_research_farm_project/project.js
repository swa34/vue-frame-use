/* global caesCache */
import RoutingAndApproval from '@/views/custom/caes_research_farm_project/RoutingAndApproval';
import SupplementalAnimalInfo from '@/views/custom/caes_research_farm_project/SupplementalAnimalInfo';
import SupplementalPlantInfo from '@/views/custom/caes_research_farm_project/SupplementalPlantInfo';
import supplementalAnimalInfoSchema from '@/schemas/caes_research_farm_project/supplemental_animal_info';
import supplementalPlantInfoSchema from '@/schemas/caes_research_farm_project/supplemental_plant_info';
import usStates from '@/modules/data/united-states';
import {
	getDepartmentHeadCollegeId,
	getProject
} from '@/modules/caesdb/caes_research_farm_project';
import { logError } from '@/modules/caesdb';

const nullTest = val => val === null || val === '';
const notNullTest = val => !nullTest(val);

const genericCommentFieldDescription = `
	Please indicate whether this project should be approved or not.  Any
	feedback you have entered in the comments field will be sent to the
	PI / project originator.
`.trim();

const getResearchFarmDependencyTest = key => {
	return (val) => {
		if (!val) return false;
		const farmIndex = caesCache.data.crfp.researchFarm.map(f => f.ID).indexOf(val);
		if (farmIndex === -1) return false;
		const farm = caesCache.data.crfp.researchFarm[farmIndex];
		return farm[key] !== null;
	};
};

const getResearchFarmDependentValueFn = key => {
	return (store) => {
		const farmId = store.state.project.PARTICIPATING_RESEARCH_FARM_ID;
		if (nullTest(farmId)) return null;
		const farmIndex = caesCache.data.crfp.researchFarm.map(f => f.ID).indexOf(farmId);
		if (farmIndex === -1) return null;
		return caesCache.data.crfp.researchFarm[farmIndex][key];
	};
};

const schema = {
	title: 'Project',
	databaseName: 'CAES_RESEARCH_FARM_PROJECT',
	tablePrefix: 'CRFP_PROJECT',
	criteria: {
		string: 'criteria_ID_eq'
	},
	fetchExisting: getProject,
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
			columnName: 'ORIGINATOR_ID',
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
			},
			customClasses: [ 'inline' ]
		},
		{
			columnName: 'END_DATE',
			type: 'datetime',
			required: true,
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: [ 'inline' ]
		},
		{
			columnName: 'PI_PERSONNEL_ID',
			prettyName: 'CAES Principle Investigator',
			type: 'int',
			constraint: {
				values: caesCache.data.crfp.principleInvestigators,
				foreignKey: 'PERSONNEL_ID',
				foreignLabel: 'FULL_NAME_LAST_FIRST'
			},
			allowNullOption: true,
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'PI_FIRST_NAME',
			prettyName: 'First Name',
			type: 'nvarchar',
			depends: {
				column: 'PI_PERSONNEL_ID',
				test: nullTest
			},
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: [ 'inline' ]
		},
		{
			columnName: 'PI_MIDDLE_NAME',
			prettyName: 'Middle Name',
			type: 'nvarchar',
			depends: {
				column: 'PI_PERSONNEL_ID',
				test: nullTest
			},
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: [ 'inline' ]
		},
		{
			columnName: 'PI_LAST_NAME',
			prettyName: 'Last Name',
			type: 'nvarchar',
			depends: {
				column: 'PI_PERSONNEL_ID',
				test: nullTest
			},
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: [ 'inline' ],
			breakAfter: true
		},
		{
			columnName: 'PI_EMAIL',
			prettyName: 'Email Address',
			type: 'nvarchar',
			inputType: 'email',
			depends: {
				column: 'PI_PERSONNEL_ID',
				test: nullTest
			},
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline']
		},
		{
			columnName: 'PI_PHONE',
			prettyName: 'Phone Number',
			type: 'nvarchar',
			inputType: 'tel',
			depends: {
				column: 'PI_PERSONNEL_ID',
				test: nullTest
			},
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline'],
			breakAfter: true
		},
		{
			columnName: 'PI_ADDRESS_1',
			prettyName: 'Address',
			type: 'nvarchar',
			depends: {
				column: 'PI_PERSONNEL_ID',
				test: nullTest
			},
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline']
		},
		{
			columnName: 'PI_ADDRESS_2',
			prettyName: 'Address (Cont.)',
			type: 'nvarchar',
			depends: {
				column: 'PI_PERSONNEL_ID',
				test: nullTest
			},
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline'],
			breakAfter: true
		},
		{
			columnName: 'PI_CITY',
			prettyName: 'City',
			type: 'nvarchar',
			depends: {
				column: 'PI_PERSONNEL_ID',
				test: nullTest
			},
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline']
		},
		{
			columnName: 'PI_STATE',
			prettyName: 'State',
			type: 'nvarchar',
			depends: {
				column: 'PI_PERSONNEL_ID',
				test: nullTest
			},
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline'],
			constraint: {
				values: usStates,
				foreignKey: 'abbreviation',
				foreignLabel: 'name'
			},
			defaultValue: "GA"
		},
		{
			columnName: 'PI_ZIPCODE',
			prettyName: 'ZIP Code',
			type: 'nvarchar',
			depends: {
				column: 'PI_PERSONNEL_ID',
				test: nullTest
			},
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline']
		},
		{
			columnName: 'PI_DEPARTMENT',
			prettyName: 'Department Name',
			type: 'nvarchar',
			depends: {
				column: 'PI_PERSONNEL_ID',
				test: nullTest
			},
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'SECONDARY_CONTACT_PERSONNEL_ID',
			prettyName: 'CAES Secondary Contact',
			type: 'int',
			constraint: {
				values: caesCache.data.crfp.secondaryContacts,
				foreignKey: 'PERSONNEL_ID',
				foreignLabel: 'FULL_NAME_LAST_FIRST'
			},
			allowNullOption: true,
			grouping: {
				section: 'General Information',
				order: 1
			}
		},
		{
			columnName: 'SECONDARY_CONTACT_FIRST_NAME',
			prettyName: 'First Name',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline']
		},
		{
			columnName: 'SECONDARY_CONTACT_MIDDLE_NAME',
			prettyName: 'Middle Name',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline']
		},
		{
			columnName: 'SECONDARY_CONTACT_LAST_NAME',
			prettyName: 'Last Name',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline'],
			breakAfter: true
		},
		{
			columnName: 'SECONDARY_CONTACT_EMAIL',
			prettyName: 'Email Address',
			type: 'nvarchar',
			inputType: 'email',
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline']
		},
		{
			columnName: 'SECONDARY_CONTACT_PHONE',
			prettyName: 'Phone Number',
			type: 'nvarchar',
			inputType: 'tel',
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline'],
			breakAfter: true
		},
		{
			columnName: 'SECONDARY_CONTACT_ADDRESS_1',
			prettyName: 'Address',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline']
		},
		{
			columnName: 'SECONDARY_CONTACT_ADDRESS_2',
			prettyName: 'Address (Cont.)',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline'],
			breakAfter: true
		},
		{
			columnName: 'SECONDARY_CONTACT_CITY',
			prettyName: 'City',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline']
		},
		{
			columnName: 'SECONDARY_CONTACT_STATE',
			prettyName: 'State',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline'],
			constraint: {
				values: usStates,
				foreignKey: 'abbreviation',
				foreignLabel: 'name'
			},
			defaultValue: "GA"
		},
		{
			columnName: 'SECONDARY_CONTACT_ZIPCODE',
			prettyName: 'ZIP Code',
			type: 'nvarchar',
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline']
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
			columnName: 'IS_RESEARCH',
			prettyName: 'Research',
			type: 'bit',
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline']
		},
		{
			columnName: 'IS_EXTENSION',
			prettyName: 'Extension',
			type: 'bit',
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline']
		},
		{
			columnName: 'IS_TEACHING',
			prettyName: 'Teaching',
			type: 'bit',
			grouping: {
				section: 'General Information',
				order: 1
			},
			customClasses: ['inline']
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
			inputType: 'file',
			grouping: {
				section: 'Scientist and Station Responsibilities',
				order: 1
			}
		},
		{
			columnName: 'PLOT_MAP_ATTACHMENT_PATH',
			prettyName: 'Plot Map',
			type: 'nvarchar',
			inputType: 'file',
			grouping: {
				section: 'Scientist and Station Responsibilities',
				order: 1
			}
		},
		{
			columnName: 'CALENDAR_ATTACHMENT_PATH',
			prettyName: 'Calendar',
			type: 'nvarchar',
			inputType: 'file',
			grouping: {
				section: 'Scientist and Station Responsibilities',
				order: 1
			}
		},
		{
			columnName: 'INVOLVES_PLANTS',
			prettyName: 'Plants',
			type: 'bit',
			grouping: {
				section: 'Scientist and Station Responsibilities',
				order: 1
			},
			customClasses: ['inline']
		},
		{
			columnName: 'INVOLVES_ANIMALS',
			prettyName: 'Animals',
			type: 'bit',
			grouping: {
				section: 'Scientist and Station Responsibilities',
				order: 1
			},
			customClasses: ['inline']
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
			description: 'Please enter the US dollar amount of funding available for this project.',
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
			getDependentValue: getResearchFarmDependentValueFn('SUPERINTENDENT_PERSONNEL_ID'),
			constraint: {
				values: caesCache.data.crfp.superintendents,
				foreignKey: 'PERSONNEL_ID',
				foreignLabel: 'DISPLAY_NAME'
			},
			grouping: {
				section: 'Routing and Approval',
				order: 1
			},
			depends: {
				column: 'PARTICIPATING_RESEARCH_FARM_ID',
				test: getResearchFarmDependencyTest('SUPERINTENDENT_PERSONNEL_ID')
			}
		},
		{
			columnName: 'SUPERINTENDENT_COMMENTS',
			type: 'nvarchar',
			inputType: 'textarea',
			description: genericCommentFieldDescription,
			grouping: {
				section: 'Routing and Approval',
				order: 1
			},
			depends: {
				column: 'PARTICIPATING_RESEARCH_FARM_ID',
				test: getResearchFarmDependencyTest('SUPERINTENDENT_PERSONNEL_ID')
			},
			extra: {
				dateColumn: 'SUPERINTENDENT_APPROVAL_DATE',
				needsApprovalButtons: true,
				personnelColumn: 'SUPERINTENDENT_PERSONNEL_ID',
				status: 'Pending Superintendent Approval'
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
			constraint: {
				values: caesCache.data.crfp.departmentHeads,
				foreignKey: 'PERSONNEL_ID',
				foreignLabel: 'DISPLAY_NAME'
			},
			getDependentValue: async (store) => {
				const piPersonnelId = store.state.project.PI_PERSONNEL_ID;
				if (nullTest(piPersonnelId)) return null;
				try {
					const dHeadId = await getDepartmentHeadCollegeId(piPersonnelId);
					const dHeadIndex = caesCache.data.crfp.departmentHeads.map(h => h.COLLEGE_ID).indexOf(dHeadId);
					if (dHeadIndex === -1) return;
					return caesCache.data.crfp.departmentHeads[dHeadIndex].PERSONNEL_ID;
				} catch (err) {
					logError(err);
				}
			},
			grouping: {
				section: 'Routing and Approval',
				order: 1
			},
			depends: {
				column: 'PI_PERSONNEL_ID',
				test: notNullTest
			}
		},
		{
			columnName: 'DEPARTMENT_HEAD_COMMENTS',
			type: 'nvarchar',
			inputType: 'textarea',
			description: genericCommentFieldDescription,
			grouping: {
				section: 'Routing and Approval',
				order: 1
			},
			depends: {
				column: 'PI_PERSONNEL_ID',
				test: notNullTest
			},
			extra: {
				dateColumn: 'DEPARTMENT_HEAD_APPROVAL_DATE',
				needsApprovalButtons: true,
				personnelColumn: 'DEPARTMENT_HEAD_PERSONNEL_ID',
				status: 'Pending Department Head Approval'
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
			constraint: {
				values: caesCache.data.crfp.finalSiteApprovers,
				foreignKey: 'PERSONNEL_ID',
				foreignLabel: 'DISPLAY_NAME'
			},
			grouping: {
				section: 'Routing and Approval',
				order: 1
			},
			getDependentValue: getResearchFarmDependentValueFn('FINAL_SITE_APPROVER_PERSONNEL_ID'),
			depends: {
				column: 'PARTICIPATING_RESEARCH_FARM_ID',
				test: getResearchFarmDependencyTest('FINAL_SITE_APPROVER_PERSONNEL_ID')
			}
		},
		{
			columnName: 'FINAL_SITE_APPROVER_COMMENTS',
			type: 'nvarchar',
			inputType: 'textarea',
			description: genericCommentFieldDescription,
			grouping: {
				section: 'Routing and Approval',
				order: 1
			},
			depends: {
				column: 'PARTICIPATING_RESEARCH_FARM_ID',
				test: getResearchFarmDependencyTest('FINAL_SITE_APPROVER_PERSONNEL_ID')
			},
			extra: {
				dateColumn: 'FINAL_SITE_APPROVER_APPROVAL_DATE',
				needsApprovalButtons: true,
				personnelColumn: 'FINAL_SITE_APPROVER_PERSONNEL_ID',
				status: 'Pending Final Site Approver Approval'
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
			constraint: {
				values: caesCache.data.crfp.officeOfResearchApprovers,
				foreignKey: 'PERSONNEL_ID',
				foreignLabel: 'DISPLAY_NAME'
			},
			grouping: {
				section: 'Routing and Approval',
				order: 1
			},
			getDependentValue: getResearchFarmDependentValueFn('OFFICE_OF_RESEARCH_APPROVER_PERSONNEL_ID'),
			depends: {
				column: 'PARTICIPATING_RESEARCH_FARM_ID',
				test: getResearchFarmDependencyTest('OFFICE_OF_RESEARCH_APPROVER_PERSONNEL_ID')
			}
		},
		{
			columnName: 'OFFICE_OF_RESEARCH_COMMENTS',
			type: 'nvarchar',
			inputType: 'textarea',
			description: genericCommentFieldDescription,
			grouping: {
				section: 'Routing and Approval',
				order: 1
			},
			depends: {
				column: 'PARTICIPATING_RESEARCH_FARM_ID',
				test: getResearchFarmDependencyTest('OFFICE_OF_RESEARCH_APPROVER_PERSONNEL_ID')
			},
			extra: {
				dateColumn: 'OFFICE_OF_RESEARCH_APPROVAL_DATE',
				needsApprovalButtons: true,
				personnelColumn: 'OFFICE_OF_RESEARCH_PERSONNEL_ID',
				status: 'Pending Office of Associate Dean of Research Approval'
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
			columnName: 'DATE_UPDATED',
			type: 'datetime',
			automated: true,
			grouping: {
				section: 'Routing and Approval',
				order: 1
			}
		}
	],
	associations: [
		{
			title: 'Supplemental Plant Information',
			schema: supplementalPlantInfoSchema,
			customComponent: SupplementalPlantInfo,
			localKey: 'ID',
			// foreignKey: 'PROJECT_ID',
			associatedColumn: 'PROJECT_ID',
			// isAssignable: true,
			grouping: {
				section: 'Scientist and Station Responsibilities',
				order: 2
			},
			depends: {
				column: 'INVOLVES_PLANTS',
				test (val) { return val === true; }
			}
		},
		{
			title: 'Supplemental Animal Information',
			schema: supplementalAnimalInfoSchema,
			customComponent: SupplementalAnimalInfo,
			localKey: 'ID',
			associatedColumn: 'PROJECT_ID',
			grouping: {
				section: 'Scientist and Station Responsibilities',
				order: 3
			},
			depends: {
				column: 'INVOLVES_ANIMALS',
				test (val) { return val === true; }
			}
		}
	],
	subschemas: [],
	sections: [
		{
			title: 'General Information',
			order: 1,
			fieldsets: [
				{
					title: 'Dates',
					columns: [
						'START_DATE',
						'END_DATE'
					]
				},
				{
					title: 'Non-CAES Principle Investigator',
					columns: [
						'PI_FIRST_NAME',
						'PI_MIDDLE_NAME',
						'PI_LAST_NAME',
						'PI_EMAIL',
						'PI_PHONE',
						'PI_ADDRESS_1',
						'PI_ADDRESS_2',
						'PI_CITY',
						'PI_STATE',
						'PI_ZIPCODE',
						'PI_DEPARTMENT'
					],
					depends: {
						column: 'PI_PERSONNEL_ID',
						test: nullTest
					}
				},
				{
					title: 'Non-CAES Secondary Contact',
					columns: [
						'SECONDARY_CONTACT_FIRST_NAME',
						'SECONDARY_CONTACT_MIDDLE_NAME',
						'SECONDARY_CONTACT_LAST_NAME',
						'SECONDARY_CONTACT_EMAIL',
						'SECONDARY_CONTACT_PHONE',
						'SECONDARY_CONTACT_ADDRESS_1',
						'SECONDARY_CONTACT_ADDRESS_2',
						'SECONDARY_CONTACT_CITY',
						'SECONDARY_CONTACT_STATE',
						'SECONDARY_CONTACT_ZIPCODE'
					],
					depends: {
						column: 'SECONDARY_CONTACT_PERSONNEL_ID',
						test: nullTest
					}
				},
				{
					title: 'Areas to Which the Project Pertains',
					columns: [
						'IS_RESEARCH',
						'IS_EXTENSION',
						'IS_TEACHING'
					]
				}
			]
		},
		{
			title: 'Summary of Project',
			order: 2
		},
		{
			title: 'Scientist and Station Responsibilities',
			order: 3,
			fieldsets: [
				{
					title: 'Project Involves Plants/Animals',
					columns: [
						'INVOLVES_PLANTS',
						'INVOLVES_ANIMALS'
					]
				}
			]
		},
		{
			title: 'Additional Responsibilities and Funding',
			order: 4
		},
		{
			title: 'Routing and Approval',
			order: 5,
			depends: {
				columns: ['PARTICIPATING_RESEARCH_FARM_ID']
			},
			customComponent: RoutingAndApproval
		}
	]
};

export default schema;

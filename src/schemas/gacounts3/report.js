// Pull in required modules
import {
	associationReportFieldSchema,
	associationReportKeywordSchema,
	associationReportProgramAreaSchema,
	associationReportTopicSchema,
	associationReportTypeSchema,
	ethnicDemographicSchema,
	racialDemographicSchema,
	reportContactSchema,
	reportPersonnelSchema,
	reportPurposeAchievementsSchema,
	subReportSchema,
	targetAudienceSchema
} from '@/schemas/gacounts3';
import {
	ccdAssociationKeywordTopicCriteriaStructure
} from '@/criteriaStructures/caes_central_database';
import {
	gc3AssociationReportTypeContactTypeCriteriaStructure,
	gc3TargetAudienceCriteriaStructure
} from '@/criteriaStructures/gacounts3';
import {
	getActivityLocationTypes,
	getAssociationKeywordTopic,
	getAssociationReportTypeContactType,
	getAssociationReportTypeProgramArea,
	getAssociationTargetAudienceProgramArea,
	getCounties,
	getProgramScopes,
	getReport
} from '@/modules/caesdb';
import SupplementalDataComponent from '@/views/custom/gacounts3/SupplementalData';
import SubReportForReportComponent from '@/views/custom/gacounts3/SubReportForReport';

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

// Adjust the racial demographic schema to suit our needs
const altRacialDemographicSchema = Object.assign({}, racialDemographicSchema);
altRacialDemographicSchema.columns = [];
racialDemographicSchema.columns.forEach((column) => {
	if (column.columnName !== 'GENDER_ID' && column.columnName !== 'QUANTITY') altRacialDemographicSchema.columns.push(column);
});
altRacialDemographicSchema.columns.push({
	columnName: 'QUANTITY_MALE',
	prettyName: 'Male',
	type: 'int',
	min: 0
});
altRacialDemographicSchema.columns.push({
	columnName: 'QUANTITY_FEMALE',
	prettyName: 'Female',
	type: 'int',
	min: 0
});
altRacialDemographicSchema.prepareForSubmit = (newRecords) => {
	// An array to hold our records to be submitted
	let transformedRecords = [];
	newRecords.forEach((record) => {
		if (record.QUANTITY_MALE > 0 || record.QUANTITY_FEMALE > 0) {
			let newRecordTemplate = {};
			for (let key in record) {
				if (key !== 'QUANTITY_MALE' && key !== 'QUANTITY_FEMALE') newRecordTemplate[key] = record[key];
			}
			if (record.QUANTITY_MALE > 0) {
				let maleRecord = Object.assign({}, newRecordTemplate);
				maleRecord.GENDER_ID = 1;
				maleRecord.QUANTITY = record.QUANTITY_MALE;
				transformedRecords.push(maleRecord);
			}
			if (record.QUANTITY_FEMALE > 0) {
				let femaleRecord = Object.assign({}, newRecordTemplate);
				femaleRecord.GENDER_ID = 2;
				femaleRecord.QUANTITY = record.QUANTITY_FEMALE;
				transformedRecords.push(femaleRecord);
			}
		}
	});
	return transformedRecords;
};
altRacialDemographicSchema.prepareFromRetrieval = (existingRecords, componentRecords) => {
	existingRecords.forEach((record) => {
		let componentRecordsRaceMap = componentRecords.map(r => r.RACE_ID);
		let matchingRecord = componentRecords[componentRecordsRaceMap.indexOf(record.RACE_ID)];
		if (record.GENDER_ID === 1) {
			matchingRecord.QUANTITY_MALE = record.QUANTITY;
		} else if (record.GENDER_ID === 2) {
			matchingRecord.QUANTITY_FEMALE = record.QUANTITY;
		}
	});
};

// Adjust the ethnic demographic schema to suit our needs
const altEthnicDemographicSchema = Object.assign({}, ethnicDemographicSchema);
altEthnicDemographicSchema.columns = [];
ethnicDemographicSchema.columns.forEach((column) => {
	if (column.columnName !== 'GENDER_ID' && column.columnName !== 'QUANTITY') altEthnicDemographicSchema.columns.push(column);
});
altEthnicDemographicSchema.columns.push({
	columnName: 'QUANTITY_MALE',
	prettyName: 'Male',
	type: 'int'
});
altEthnicDemographicSchema.columns.push({
	columnName: 'QUANTITY_FEMALE',
	prettyName: 'Female',
	type: 'int'
});
altEthnicDemographicSchema.prepareFromRetrieval = (existingRecords, componentRecords) => {
	existingRecords.forEach((record) => {
		let componentRecordsEthnicMap = componentRecords.map(r => r.ETHNICITY_ID);
		let matchingRecord = componentRecords[componentRecordsEthnicMap.indexOf(record.ETHNICITY_ID)];
		if (record.GENDER_ID === 1) {
			matchingRecord.QUANTITY_MALE = record.QUANTITY;
		} else if (record.GENDER_ID === 2) {
			matchingRecord.QUANTITY_FEMALE = record.QUANTITY;
		}
	});
};

// Define our demographics test function to be reused for each of the
// demographic associations
const demographicsTest = (records, schema) => {
	let passes = false;
	const associationsMap = schema.associations.map(a => a.title);
	const association = schema.associations[associationsMap.indexOf('Contacts')];
	const columnsMap = association.schema.columns.map(c => c.columnName);
	const column = association.schema.columns[columnsMap.indexOf('TYPE_ID')];
	const values = column.constraint.values;
	const valuesIdMap = values.map(v => v.key);
	const valuesUsesDemographicsMap = values.map(v => v.originalValue.USES_DEMOGRAPHICS);
	records.forEach((record) => {
		if (valuesUsesDemographicsMap[valuesIdMap.indexOf(record.TYPE_ID)]) passes = true;
	});
	return passes;
};

// And finally define the schema itself
const schema = {
	title: 'Report',
	tablePrefix: 'GC3_REPORT',
	criteria: {
		string: 'criteria_ID_eq'
	},
	fetchExisting: getReport,
	columns: [
		{
			columnName: 'ID',
			type: 'int',
			immutable: true,
			prettyName: 'ID',
			automated: true,
			grouping: {
				section: 'Main Report Information',
				order: 1
			}
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
			},
			grouping: {
				section: 'Main Report Information',
				order: 2
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
			},
			grouping: {
				section: 'Main Report Information',
				order: 3
			}
		},
		{
			columnName: 'TITLE',
			type: 'nvarchar',
			required: true,
			grouping: {
				section: 'Main Report Information',
				order: 4
			}
		},
		{
			columnName: 'SCOPE_ID',
			prettyName: 'Geographic Reach of Activity',
			type: 'int',
			required: true,
			constraint: {
				getValues: getProgramScopes,
				database: 'CAES_CENTRAL_DATABASE',
				table: 'PROGRAM_SCOPE',
				foreignKey: 'ID',
				foreignLabel: 'LABEL',
				values: []
			},
			grouping: {
				section: 'Main Report Information',
				order: 5
			}
		},
		{
			columnName: 'ACTIVITY_LOCATION_TYPE_ID',
			prettyName: 'Location of Activity',
			type: 'int',
			constraint: {
				getValues: getActivityLocationTypes,
				database: 'GACOUNTS3',
				table: 'ACTIVITY_LOCATION_TYPE',
				foreignKey: 'ID',
				foreignLabel: 'LABEL',
				values: []
			},
			grouping: {
				section: 'Main Report Information',
				order: 6
			}
		},
		{
			columnName: 'COUNTY_ID',
			prettyName: 'County',
			type: 'int',
			required: true,
			constraint: {
				getValues: getCounties,
				database: 'Portal',
				table: 'CountyList',
				foreignKey: 'COUNTYLISTID',
				foreignLabel: 'COUNTYNAME',
				values: []
			},
			depends: {
				column: 'ACTIVITY_LOCATION_TYPE_ID',
				test (val) {
					const activityLocationMap = activityLocations.map(location => location.ID);
					const activityLocationIndex = activityLocationMap.indexOf(Number(val));
					return activityLocationIndex !== -1 && !activityLocations[activityLocationIndex].USES_ALTERNATE_TEXT;
				}
			},
			grouping: {
				section: 'Main Report Information',
				order: 7
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
					const activityLocationIndex = activityLocationMap.indexOf(Number(val));
					return activityLocationIndex !== -1 && activityLocations[activityLocationIndex].USES_ALTERNATE_TEXT;
				}
			},
			grouping: {
				section: 'Main Report Information',
				order: 8
			}
		},
		{
			columnName: 'DATE_BEGIN',
			prettyName: 'Begin Date',
			type: 'datetime',
			required: true,
			grouping: {
				section: 'Main Report Information',
				order: 9
			}
		},
		{
			columnName: 'DATE_END',
			prettyName: 'End Date',
			type: 'datetime',
			required: true,
			grouping: {
				section: 'Main Report Information',
				order: 10
			}
		},
		{
			columnName: 'DATE_CREATED',
			type: 'datetime',
			required: true,
			automated: true,
			grouping: {
				section: 'Main Report Information',
				order: 11
			}
		},
		{
			columnName: 'DATE_LAST_UPDATED',
			type: 'datetime',
			required: true,
			automated: true,
			grouping: {
				section: 'Main Report Information',
				order: 12
			}
		}
	],
	associations: [
		{
			title: 'Program Areas',
			schema: associationReportProgramAreaSchema,
			localKey: 'ID',
			foreignKey: 'REPORT_ID',
			associatedColumn: 'AREA_ID',
			multiSelect: true,
			grouping: {
				section: 'Main Report Information',
				order: 13
			},
			description: 'Bacon ipsum dolor amet t-bone pork voluptate officia dolore prosciutto commodo pork loin jerky brisket hamburger. Dolore ullamco shoulder velit, nulla sausage kevin andouille shank sirloin pork chop. Cupim bresaola bacon kielbasa excepteur magna, consectetur exercitation. Cow nostrud filet mignon pork reprehenderit ut, ground round strip steak adipisicing.'
		},
		{
			title: 'Report Type',
			schema: associationReportTypeSchema,
			localKey: 'ID',
			foreignKey: 'REPORT_ID',
			associatedColumn: 'TYPE_ID',
			isAssignable: true,
			forbidMultiple: true,
			grouping: {
				section: 'Main Report Information',
				order: 14
			},
			filter: {
				association: {
					title: 'Program Areas',
					column: 'AREA_ID'
				},
				getValues: getAssociationReportTypeProgramArea,
				database: 'GACOUNTS3',
				table: 'ASSOCIATION_REPORT_TYPE_PROGRAM_AREA',
				associatedColumn: 'AREA_ID',
				optionColumn: 'REPORT_TYPE_ID'
			},
			description: 'Bacon ipsum dolor amet tri-tip pancetta ea meatball spare ribs. Tenderloin porchetta velit pariatur ad. Pork loin exercitation excepteur cupim. Ground round deserunt pancetta, et bacon est jerky eiusmod tail sausage in dolor corned beef lorem. Pancetta aliqua rump pig boudin.'
		},
		{
			title: 'Topics',
			schema: associationReportTopicSchema,
			localKey: 'ID',
			foreignKey: 'REPORT_ID',
			associatedColumn: 'TOPIC_ID',
			multiSelect: true,
			grouping: {
				section: 'Topics and Keywords',
				order: 1
			},
			groupBy: 'AREA_ID',
			groupLabel: 'PROGRAM_AREA_ABBREVIATION',
			groupsToShow: {
				association: 'Program Areas',
				column: 'AREA_ID'
			},
			description: 'Bacon ipsum dolor amet id aliqua sed sint magna short ribs, velit shankle pastrami laborum in lorem corned beef anim. Ut officia voluptate bresaola esse enim alcatra ham pork loin spare ribs drumstick chicken. Reprehenderit ut ground round aliqua andouille turducken nulla filet mignon flank ball tip. Jerky quis biltong, id picanha salami turducken qui elit. Tri-tip incididunt chuck, qui officia pig pork belly kevin turkey spare ribs kielbasa nisi. Cow ball tip dolore incididunt chuck hamburger.\n\nPancetta pork proident, elit chuck drumstick porchetta chicken exercitation tri-tip ut. Mollit shank picanha prosciutto incididunt kielbasa. Andouille mollit kielbasa, aliquip sirloin ut magna aute deserunt. Frankfurter duis aute, et est tail jerky pariatur burgdoggen. Nisi venison porchetta ullamco.'
		},
		{
			title: 'Keywords',
			schema: associationReportKeywordSchema,
			localKey: 'ID',
			foreignKey: 'REPORT_ID',
			associatedColumn: 'KEYWORD_ID',
			multiSelect: true,
			grouping: {
				section: 'Topics and Keywords',
				order: 2
			},
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
				getValues: getAssociationKeywordTopic,
				database: 'CAES_CENTRAL_DATABASE',
				table: 'ASSOCIATION_KEYWORD_TOPIC',
				optionColumn: 'KEYWORD_ID',
				criteriaStructure: ccdAssociationKeywordTopicCriteriaStructure
			},
			description: 'Bacon ipsum dolor amet aliqua bresaola ipsum, beef ribs dolore filet mignon pork laboris tongue. Adipisicing commodo officia tenderloin shank rump jerky minim landjaeger andouille. Est cillum proident shoulder fugiat. Non bacon aute tempor beef kevin boudin short loin tri-tip chicken. Landjaeger dolor in officia pork belly magna commodo turducken id kielbasa nostrud flank strip steak eu. Duis velit quis pig qui sausage, tempor cow. Occaecat minim in sed, excepteur aliquip pork chop shank ground round dolore sunt reprehenderit voluptate.'
		},
		{
			title: 'Contacts',
			schema: reportContactSchema,
			localKey: 'ID',
			foreignKey: 'REPORT_ID',
			associatedColumn: 'REPORT_ID',
			optionColumnName: 'TYPE_ID',
			isAssignable: true,
			grouping: {
				section: 'Demographic Information',
				order: 1
			},
			displayAllOptions: true,
			showTotals: true,
			filter: {
				associations: [
					{
						title: 'Report Type',
						column: 'TYPE_ID',
						criteriaColumn: 'REPORT_TYPE_ID'
					}
				],
				getValues: getAssociationReportTypeContactType,
				database: 'GACOUNTS3',
				table: 'ASSOCIATION_REPORT_TYPE_CONTACT_TYPE',
				optionColumn: 'CONTACT_TYPE_ID',
				criteriaStructure: gc3AssociationReportTypeContactTypeCriteriaStructure
			},
			description: 'Turkey bresaola fugiat, minim landjaeger do andouille ham. Ut tri-tip landjaeger fugiat. Non sed sunt, meatloaf lorem strip steak jowl reprehenderit. Nulla tempor laborum fugiat kevin, shank dolore sed ea ipsum rump hamburger incididunt. Esse adipisicing kielbasa corned beef venison nulla. Shankle laboris short loin turducken minim. Meatball sunt shankle, swine excepteur lorem ball tip occaecat sirloin enim reprehenderit eiusmod.'
		},
		{
			title: 'Racial Demographics',
			schema: altRacialDemographicSchema,
			localKey: 'ID',
			foreignKey: 'REPORT_ID',
			associatedColumn: 'REPORT_ID',
			optionColumnName: 'RACE_ID',
			isAssignable: true,
			displayAllOptions: true,
			showTotals: true,
			grouping: {
				section: 'Demographic Information',
				order: 3
			},
			depends: {
				association: 'Contacts',
				useValues: true,
				test: demographicsTest
			}
		},
		{
			title: 'Ethnic Demographics',
			schema: altEthnicDemographicSchema,
			localKey: 'ID',
			foreignKey: 'REPORT_ID',
			associatedColumn: 'REPORT_ID',
			optionColumnName: 'ETHNICITY_ID',
			isAssignable: true,
			displayAllOptions: true,
			showTotals: true,
			grouping: {
				section: 'Demographic Information',
				order: 4
			},
			depends: {
				association: 'Contacts',
				useValues: true,
				test: demographicsTest
			}
		},
		{
			title: 'Target Audiences',
			schema: targetAudienceSchema,
			localKey: 'ID',
			foreignKey: 'REPORT_ID',
			associatedColumn: 'REPORT_ID',
			optionColumnName: 'TYPE_ID',
			isAssignable: true,
			displayAllOptions: true,
			showTotals: true,
			grouping: {
				section: 'Demographic Information',
				order: 2
			},
			filter: {
				associations: [
					{
						title: 'Program Areas',
						column: 'AREA_ID'
					}
				],
				getValues: getAssociationTargetAudienceProgramArea,
				optionColumn: 'AUDIENCE_ID',
				criteriaStructure: gc3TargetAudienceCriteriaStructure
			}
		},
		{
			title: 'Supplemental Data',
			schema: associationReportFieldSchema,
			customComponent: SupplementalDataComponent,
			isAssignable: true,
			grouping: {
				section: 'Supplemental Data',
				order: 1
			}
		},
		// {
		// 	title: 'Outcome, Impact, and Achievements',
		// 	schema: reportPurposeAchievementsSchema,
		// 	criteriaString: 'criteria_REPORT_ID_eq',
		// 	localKey: 'ID',
		// 	foreignKey: 'REPORT_ID',
		// 	isAssignable: true
		// },
		{
			title: 'Collaborators',
			schema: reportPersonnelSchema,
			localKey: 'ID',
			foreignKey: 'REPORT_ID',
			associatedColumn: 'PERSONNEL_ID',
			isAssignable: true,
			grouping: {
				section: 'Collaborators',
				order: 1
			}
		}
	],
	subschemas: [
		{
			title: 'Sub-Report',
			schema: subReportSchema,
			customComponent: SubReportForReportComponent,
			grouping: {
				section: 'My Sub-Report',
				order: 1
			}
		}
	],
	sections: [
		{
			title: 'Main Report Information',
			order: 1
		},
		{
			title: 'Topics and Keywords',
			order: 2
		},
		{
			title: 'Demographic Information',
			order: 3
		},
		{
			title: 'Supplemental Data',
			order: 4
		},
		{
			title: 'My Sub-Report',
			order: 5
		},
		{
			title: 'Collaborators',
			order: 6
		}
	]
};

export default schema;

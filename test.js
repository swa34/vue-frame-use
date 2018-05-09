const ccdAssociationKeywordTopicPopulateCriteriaStructure	= require('./src/criteriaStructures/caes_central_database/association_report_keyword.js');
const filter = require('./src/modules/criteriaFilter.js');

const critStruct = ccdAssociationKeywordTopicPopulateCriteriaStructure();

critStruct.criteria_KEYWORD_ID_eq = '1,3';
critStruct.criteria_AREA_ID_lt = 5;
critStruct.criteria_TOPIC_ID_gt = 3;

const records = [
	// Should be accepted
	{
		KEYWORD_ID: 1,
		AREA_ID: 4,
		TOPIC_ID: 4,
		shouldPass: true
	},
	{
		KEYWORD_ID: 3,
		AREA_ID: 1,
		TOPIC_ID: 8,
		shouldPass: true
	},
	// Should be rejected
	{
		KEYWORD_ID: 2,
		AREA_ID: 5,
		TOPIC_ID: 3,
		shouldPass: false
	},
	{
		KEYWORD_ID: 3,
		TOPIC_ID: 8,
		shouldPass: false
	}
];

const filteredRecords = filter(records, critStruct);

console.log(filteredRecords);

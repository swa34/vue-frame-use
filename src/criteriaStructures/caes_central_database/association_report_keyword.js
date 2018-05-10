// A skeleton structure to be used as default keys/values when creating a
// criteria structure.
const ccdAssociationKeywordTopicCriteriaStructure = {
	submitSearch: true,
	displayMode: 'NORMAL',
	queryMode: 'NORMAL',
	SortKey: null,
	criteria_KEYWORD_ID_eq: [],
	criteria_KEYWORD_ID_neq: [],
	criteria_KEYWORD_ID_gt: null,
	criteria_KEYWORD_ID_lt: null,
	criteria_AREA_ID_eq: [],
	criteria_AREA_ID_neq: [],
	criteria_AREA_ID_gt: null,
	criteria_AREA_ID_lt: null,
	criteria_TOPIC_ID_eq: [],
	criteria_TOPIC_ID_neq: [],
	criteria_TOPIC_ID_gt: null,
	criteria_TOPIC_ID_lt: null
};

// const ccdAssociationKeywordTopicPopulateCriteriaStructure = (paramCriteriaStructure = {}, paramSecondaryStructure = {}) => {
// 	// Clone the optional criteria structure param into result
// 	let result = Object.assign({}, paramCriteriaStructure);
// 	// Do the same for the secondary structure
// 	let secondaryStructure = Object.assign({}, paramSecondaryStructure);
// 	// Loop through the skeleton
// 	for (let key in ccdAssociationKeywordTopicCriteriaStructureSkeleton) {
// 		// If the secondary structure does not have one of the skeleton properties,
// 		// or the property is null/undefined, copy the skeleton key/value in to the
// 		// secondary structure.
// 		if (!secondaryStructure.hasOwnProperty(key) || secondaryStructure[key] === null || typeof secondaryStructure[key] === 'undefined') secondaryStructure[key] = ccdAssociationKeywordTopicCriteriaStructureSkeleton[key];
// 	}
// 	// Loop through the secondary structure
// 	for (let key in secondaryStructure) {
// 		// Same as above, set the key/value if it doesn't exist in result already
// 		if (!result.hasOwnProperty(key) || result[key] === null || typeof result[key] === 'undefined') result[key] = secondaryStructure[key];
// 	}
// 	// If the criteria struct is not being used for searching, set query mode to
// 	// schema only
// 	if (!result.submitSearch) result.queryMode = 'SCHEMA_ONLY';
//
// 	// Return the resulting criteria structure
// 	return result;
// };

// export default ccdAssociationKeywordTopicPopulateCriteriaStructure;
export default ccdAssociationKeywordTopicCriteriaStructure;

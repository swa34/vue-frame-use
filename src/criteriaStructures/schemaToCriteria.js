const criteriaFields = [
	'eq',
	'neq',
	'gt',
	'lt'
];

const getCriteriaStructure = (schema) => {
	let criteriaStructure = {
		submitSearch: true,
		displayMode: 'NORMAL',
		queryMode: 'NORMAL',
		sortKey: ''
	};
	schema.columns.forEach((column) => {
		criteriaFields.forEach((field) => {
			criteriaStructure['criteria_' + column.columnName + '_' + field] = '';
		});
	});
	return criteriaStructure;
};

// export default { getCriteriaStructure };
module.exports = { getCriteriaStructure };

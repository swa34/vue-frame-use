// Regular expressions used to determine the functionality of the criteria
// structure lines.
const rgx = {
	criteria: /^criteria_/,
	key: /^criteria_(.*)_(?:n?eq|gt|lt)$/,
	comparison: /_([^_]+)$/,
	eq: /_eq$/,
	neq: /_neq$/,
	gt: /_gt$/,
	lt: /_lt$/
};

// Object to contain our comparison functions
const compare = {
	eq: (a, b) => b.split(',').indexOf(a.toString()) !== -1,
	neq: (a, b) => b.split(',').indexOf(a.toString()) === -1,
	gt: (a, b) => a > b,
	lt: (a, b) => a < b
};

// Function to convert criteria key to object
const criteriaToObj = (criteria, value) => {
	// If the criteria doesn't begin with 'criteria_', it's invalid (for now) so
	// return null.
	if (!rgx.criteria.test(criteria)) return null;

	// If the criteria value is empty, we don't care about it
	if (!value || value.length < 1) return null;

	// Attempt to get the criteria key, returning null if no match found
	const criteriaKeyMatch = criteria.match(rgx.key);
	if (!criteriaKeyMatch[1]) return null;

	// Do the same for the comparison
	const criteriaComparisonMatch = criteria.match(rgx.comparison);
	if (!criteriaComparisonMatch[1]) return null;

	// Create the criteria object
	const obj = {
		key: criteriaKeyMatch[1],
		comparison: criteriaComparisonMatch[1],
		value,
		test (record) {
			// If the record doesn't contain the key, it's invalid
			if (!record[this.key]) return false;
			return compare[this.comparison](record[this.key], this.value);
		}
	};

	// And return it
	return obj;
};

// The actual filtering function, which will filter out results that do not meet
// the specified criteria.
const filter = (records, criteriaStructure = {}) => {
	// An array to hold records that satisfy the criteria
	let newRecords = [];

	// Loop through each of the records
	records.forEach((record) => {
		let recordIsValid = true;
		for (let key in criteriaStructure) {
			// Convert the key to an object
			const criteria = criteriaToObj(key, criteriaStructure[key]);

			// If the criteria is invalid, skip it
			if (!criteria) continue;

			// Test the record
			recordIsValid = criteria.test(record);

			// If the record is invalid, exit the loop
			if (!recordIsValid) break;
		}
		// Self-explanatory
		if (recordIsValid) newRecords.push(record);
	});

	// Return the valid records
	return newRecords;
};

// We only want to export the filter function
// export default filter;
module.exports = filter;

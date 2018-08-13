const prepareForCf = (object) => {
	if (Array.isArray(object)) {
		let newArr = [];
		object.forEach((record, i) => {
			if (record !== null && typeof record === 'object') {
				newArr[i] = prepareForCf(record);
			} else if (record === null) {
				newArr[i] = '';
			} else if (typeof record === 'boolean') {
				newArr[i] = record ? 1 : 0;
			} else {
				newArr[i] = record;
			}
		});
		return newArr;
	} else {
		let newObj = {};
		for (let key in object) {
			let record = object[key];
			if (record !== null && typeof record === 'object') {
				newObj[key] = prepareForCf(record);
			} else if (record === null) {
				newObj[key] = '';
			} else if (typeof record === 'boolean') {
				newObj[key] = record ? 1 : 0;
			} else {
				newObj[key] = record;
			}
		}
		return newObj;
	}
};

export default prepareForCf;

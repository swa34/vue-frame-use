const getObjectIndexedByKeyFromArray = (arr, key) => {
	return arr.reduce((finalObject, item) => {
		finalObject[item[key]] = item;
		return finalObject;
	}, {});
};

export default getObjectIndexedByKeyFromArray;

const enableConstraintValues = (schema) => {
	schema.columns.forEach((column) => {
		if (column.constraint && !column.constraint.values) column.constraint.values = [];
	});
	return schema;
};

export {
	enableConstraintValues
};

const importantDateSchema = {
	title: 'Important Date',
	columns: [
		{
			columnName: 'SUPPLEMENTAL_ANIMAL_INFO_ID',
			immutable: true,
			automated: true
		},
		{
			columnName: 'IMPORTANT_DATE',
			prettyName: 'Date',
			type: 'datetime',
			required: true
		},
		{
			columnName: 'DESCRIPTION',
			prettyName: 'Procedure or activity to be performed',
			type: 'nvarchar',
			inputType: 'textarea',
			required: true
		}
	]
};

export default importantDateSchema;

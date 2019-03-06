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
			type: 'datetime'
		},
		{
			columnName: 'DESCRIPTION',
			prettyName: 'Procedure or activity to be performed',
			type: 'nvarchar'
		}
	]
};

export default importantDateSchema;

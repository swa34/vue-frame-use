const schema = {
    title: 'Project',
    columns: [
        {
            columnName: 'ID',
            type: 'int',
            immutable: true,
            automated: true
        },
        {
            columnName: 'START_DATE',
            type: 'datetime',
            required: true
        },
        {
            columnName: 'PI_FIRST_NAME',
            prettyName: 'First Name',
            type: 'nvarchar',
            required: false
        }
    ],
    associations: [],
    subschemas: []
};

export default schema;
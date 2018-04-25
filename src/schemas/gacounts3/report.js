// Gotta fetch activity locations
let activityLocations = [
	{
		ID: 1,
		LABEL: 'Inside Georgia',
		USES_ALTERNATE_TEXT: 0
	},
	{
		ID: 2,
		LABEL: 'Outside Georgia, Inside U.S.',
		USES_ALTERNATE_TEXT: 1
	},
	{
		ID: 3,
		LABEL: 'Outside U.S.',
		USES_ALTERNATE_TEXT: 1
	}
];

const schema = {
	database: 'GACOUNTS3',
	table: 'REPORT',
	columns: [
		{
			columnName: 'ID',
			type: 'int',
			immutable: true,
			prettyName: 'ID'
		},
		{
			columnName: 'OWNER_ID',
			type: 'int',
			required: true,
			constraint: {
				database: 'CAES_CENTRAL_DATABASE',
				table: 'PERSONNEL',
				foreignKey: 'ID',
				values: []
			}
		},
		{
			columnName: 'ACTUAL_SUBMITTER_ID',
			type: 'int',
			required: true,
			constraint: {
				database: 'CAES_CENTRAL_DATABASE',
				table: 'PERSONNEL',
				foreignKey: 'ID',
				values: []
			}
		},
		{
			columnName: 'TITLE',
			type: 'nvarchar',
			required: true
		},
		{
			columnName: 'DATE_BEGIN',
			type: 'datetime',
			required: true
		},
		{
			columnName: 'DATE_END',
			type: 'datetime',
			required: true
		},
		{
			columnName: 'COUNTY_ID',
			type: 'int',
			required: true,
			constraint: {
				database: 'Portal',
				table: 'CountyList',
				foreignKey: 'CountyListID',
				values: []
			}
		},
		{
			columnName: 'SCOPE_ID',
			type: 'int',
			required: true,
			constraint: {
				database: 'CAES_CENTRAL_DATABASE',
				table: 'PROGRAM_SCOPE',
				foreignKey: 'ID',
				foreignLabel: 'LABEL',
				values: []
			}
		},
		{
			columnName: 'ACTIVITY_LOCATION_TYPE_ID',
			type: 'int',
			constraint: {
				database: 'GACOUNTS3',
				table: 'ACTIVITY_LOCATION_TYPE',
				foreignKey: 'ID',
				foreignLabel: 'LABEL',
				values: []
			}
		},
		{
			columnName: 'ACTIVITY_LOCATION_ALTERNATE_TEXT',
			type: 'nvarchar',
			depends: {
				column: 'ACTIVITY_LOCATION_TYPE_ID',
				test (val) {
					const activityLocationMap = activityLocations.map(location => location.ID);
					const activityLocationIndex = activityLocationMap.indexOf(val);
					return activityLocationIndex !== -1 && activityLocations[activityLocationIndex].USES_ALTERNATE_TEXT;
				}
			}
		},
		{
			columnName: 'DATE_CREATED',
			type: 'datetime',
			required: true
		},
		{
			columnName: 'DATE_LAST_UPDATED',
			type: 'datetime',
			required: true
		}
	]
};

export default schema;

const supplementalPlantInfoSchema = {
	title: 'Supplemental Plant Information',
	columns: [
		{
			columnName: 'ID',
			type: 'int',
			immutable: true,
			automated: true
		},
		{
			columnName: 'PROJECT_ID',
			type: 'int',
			immutable: true,
			automated: true
		},
		{
			columnName: 'IS_SAFE',
			prettyName: 'By checking this box, the principle investigators confirm that all of the resulting plant material is safe for livestock consumption and/or consumer markets.',
			type: 'bit',
			required: true
		},
		{
			columnName: 'MUST_BE_DESTROYED',
			prettyName: 'By checking this box, the principle investigators confirm that all or some portion of the resulting plant material must be destroyed.',
			type: 'bit',
			required: true
		},
		{
			columnName: 'FIELD_NAME',
			prettyName: 'Experimental field name of designation (will be populated by superintendent at a later time)',
			type: 'nvarchar'
		},
		{
			columnName: 'LAND_PREPARATION_TEXT',
			prettyName: 'Land Preparation',
			type: 'nvarchar',
			tableGroup: {
				name: 'landPreparation',
				class: 'text'
			}
		},
		{
			columnName: 'LAND_PREPARATION_PARTY_ID',
			type: 'int',
			tableGroup: {
				name: 'landPreparation',
				class: 'party'
			}
		},
		{
			columnName: 'FERTILIZER_TEXT',
			prettyName: 'Fertilizer',
			type: 'nvarchar',
			tableGroup: {
				name: 'fertilizer',
				class: 'text'
			}
		},
		{
			columnName: 'FERTILIZER_PARTY_ID',
			type: 'int',
			tableGroup: {
				name: 'fertilizer',
				class: 'party'
			}
		},
		{
			columnName: 'CULTIVATION_TEXT',
			prettyName: 'Planting',
			type: 'nvarchar',
			tableGroup: {
				name: 'cultivation',
				class: 'text'
			}
		},
		{
			columnName: 'CULTIVATION_PARTY_ID',
			type: 'int',
			tableGroup: {
				name: 'cultivation',
				class: 'party'
			}
		},
		{
			columnName: 'PEST_CONTROL_TEXT',
			prettyName: 'Pest Control (include cultivation, pre-, post-, in-season pesticide applications, etc.)',
			type: 'nvarchar',
			tableGroup: {
				name: 'pestControl',
				class: 'text'
			}
		},
		{
			columnName: 'PEST_CONTROL_PARTY_ID',
			type: 'int',
			tableGroup: {
				name: 'pestControl',
				class: 'party'
			}
		},
		{
			columnName: 'PLOT_MAINTENANCE_TEXT',
			prettyName: 'Alley Maintenance',
			type: 'nvarchar',
			tableGroup: {
				name: 'plotMaintenance',
				class: 'text'
			}
		},
		{
			columnName: 'PLOT_MAINTENANCE_PARTY_ID',
			type: 'int',
			tableGroup: {
				name: 'plotMaintenance',
				class: 'party'
			}
		},
		{
			columnName: 'STAKING_TEXT',
			prettyName: 'Staking/Dimensioning/Lay-Out',
			type: 'nvarchar',
			tableGroup: {
				name: 'staking',
				class: 'text'
			}
		},
		{
			columnName: 'STAKING_PARTY_ID',
			type: 'int',
			tableGroup: {
				name: 'staking',
				class: 'party'
			}
		},
		{
			columnName: 'SIGNS_TEXT',
			prettyName: 'Plot/Treatment Identification (Flags, stakes, etc. / Must be removed at end of experiment)',
			type: 'nvarchar',
			tableGroup: {
				name: 'signs',
				class: 'text'
			}
		},
		{
			columnName: 'SIGNS_PARTY_ID',
			type: 'int',
			tableGroup: {
				name: 'signs',
				class: 'party'
			}
		},
		{
			columnName: 'IRRIGATION_TEXT',
			prettyName: 'Irrigation (if applicable)',
			type: 'nvarchar',
			tableGroup: {
				name: 'irrigation',
				class: 'text'
			}
		},
		{
			columnName: 'IRRIGATION_PARTY_ID',
			type: 'int',
			tableGroup: {
				name: 'irrigation',
				class: 'party'
			}
		},
		{
			columnName: 'NOTES_TEXT',
			prettyName: 'Data Collection (notes/samples/weather data)',
			type: 'nvarchar',
			tableGroup: {
				name: 'notes',
				class: 'text'
			}
		},
		{
			columnName: 'NOTES_PARTY_ID',
			type: 'int',
			tableGroup: {
				name: 'notes',
				class: 'party'
			}
		},
		{
			columnName: 'HARVEST_TEXT',
			prettyName: 'Harvest',
			type: 'nvarchar',
			tableGroup: {
				name: 'harvest',
				class: 'text'
			}
		},
		{
			columnName: 'HARVEST_PARTY_ID',
			type: 'int',
			tableGroup: {
				name: 'harvest',
				class: 'party'
			}
		},
		{
			columnName: 'POST_HARVEST_TEXT',
			prettyName: 'Post-Harvest',
			type: 'nvarchar',
			tableGroup: {
				name: 'postHarvest',
				class: 'text'
			}
		},
		{
			columnName: 'POST_HARVEST_PARTY_ID',
			type: 'int',
			tableGroup: {
				name: 'postHarvest',
				class: 'party'
			}
		},
		{
			columnName: 'SALES_TEXT',
			prettyName: 'Sale and Final Disposition of Product(s) (follow appropriate crop destruct guidelines)',
			type: 'nvarchar',
			tableGroup: {
				name: 'sales',
				class: 'text'
			}
		},
		{
			columnName: 'SALES_PARTY_ID',
			type: 'int',
			tableGroup: {
				name: 'sales',
				class: 'party'
			}
		}
	]
};

export default supplementalPlantInfoSchema;

const reportDuplication = {
	title: 'Report Duplication',
	instruction: 'Please select which sections you would like to copy into your new report:',
	sections: {
		'Title': {
			duplicate: false,
			areas: {
				columns: [
					'TITLE'
				]
			}
		},
		'Location Information': {
			duplicate: true,
			areas: {
				columns: [
					'SCOPE_ID',
					'ACTIVITY_LOCATION_TYPE_ID',
					'COUNTY_ID',
					'ACTIVITY_LOCATION_ALTERNATE_TEXT'
				]
			}
		},
		'Dates': {
			duplicate: false,
			areas: {
				columns: [
					'DATE_BEGIN',
					'DATE_END'
				]
			}
		},
		'Program Areas': {
			duplicate: true,
			areas: {
				associations: [
					'programAreas'
				]
			}
		},
		'Report Type': {
			duplicate: true,
			areas: {
				associations: [
					'reportType'
				]
			},
			depends: [
				'Program Areas'
			]
		},
		'Topics and Keywords': {
			duplicate: true,
			areas: {
				associations: [
					'topics',
					'keywords'
				]
			},
			depends: [
				'Program Areas',
				'Report Type'
			]
		},
		'Demographic Information': {
			title: 'Demographic Information',
			duplicate: false,
			areas: {
				associations: [
					'contacts',
					'racialDemographics',
					'ethnicDemographics',
					'residenceDemographics',
					'targetAudiences'
				]
			},
			depends: [
				'Program Areas',
				'Report Type',
				'Topics and Keywords'
			]
		},
		'Supplemental Data': {
			duplicate: false,
			areas: {
				associations: [
					'supplementalData'
				]
			},
			depends: [
				'Program Areas',
				'Report Type',
				'Topics and Keywords'
			]
		},
		'Sub-Report': {
			duplicate: false,
			areas: {
				subschemas: [
					'subReport'
				]
			},
			depends: [
				'Program Areas',
				'Report Type',
				'Topics and Keywords'
			]
		},
		'Collaborators': {
			title: 'Collaborators',
			duplicate: false,
			areas: {
				associations: [
					'collaborators'
				]
			}
		}
	}
};

export default reportDuplication;

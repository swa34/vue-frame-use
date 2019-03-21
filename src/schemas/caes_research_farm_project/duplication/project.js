const projectDuplication = {
	title: 'Research Farm Project Duplication',
	instruction: `
		Please select below which sections you would like to copy into your new
		project.
	`.trim(),
	sections: {
		'Title': {
			duplicate: true,
			areas: {
				columns: [
					'TITLE'
				]
			}
		},
		'Participating Research Farm': {
			duplicate: true,
			areas: {
				columns: [
					'PARTICIPATING_RESEARCH_FARM_ID'
				]
			}
		},
		'Dates': {
			duplicate: false,
			areas: {
				columns: [
					'START_DATE',
					'END_DATE'
				]
			}
		},
		'Principal Investigator': {
			duplicate: true,
			areas: {
				columns: [
					'PI_PERSONNEL_ID',
					'PI_FIRST_NAME',
					'PI_MIDDLE_NAME',
					'PI_LAST_NAME',
					'PI_EMAIL',
					'PI_PHONE',
					'PI_ADDRESS_1',
					'PI_ADDRESS_2',
					'PI_CITY',
					'PI_STATE',
					'PI_ZIPCODE',
					'PI_DEPARTMENT'
				]
			}
		},
		'Secondary Contact': {
		  duplicate: true,
		  areas: {
		    columns: [
		      'SECONDARY_CONTACT_PERSONNEL_ID',
		      'SECONDARY_CONTACT_FIRST_NAME',
		      'SECONDARY_CONTACT_MIDDLE_NAME',
		      'SECONDARY_CONTACT_LAST_NAME',
		      'SECONDARY_CONTACT_EMAIL',
		      'SECONDARY_CONTACT_PHONE',
		      'SECONDARY_CONTACT_ADDRESS_1',
		      'SECONDARY_CONTACT_ADDRESS_2',
		      'SECONDARY_CONTACT_CITY',
		      'SECONDARY_CONTACT_STATE',
		      'SECONDARY_CONTACT_ZIPCODE'
		    ]
		  }
		},
		'Commodity, Discipline, and Areas to Which the Project Pertains': {
			duplicate: true,
			areas: {
				columns: [
					'COMMODITY_ID',
					'DISCIPLINE_ID',
					'IS_RESEARCH',
					'IS_EXTENSION',
					'IS_TEACHING'
				]
			}
		},
		'Summary of Project': {
			duplicate: true,
			areas: {
				columns: [
					'RATIONALE',
					'OBJECTIVES_SUMMARY'
				]
			}
		},
		'Plan of Work': {
			duplicate: true,
			areas: {
				columns: ['PLAN_OF_WORK']
			}
		},
		'Plant Science Project Information': {
			duplicate: false,
			areas: {
				columns: ['INVOLVES_PLANTS'],
				associations: ['supplementalPlantInformation']
			}
		},
		'Animal Science Project Information': {
			duplicate: false,
			areas: {
				columns: ['INVOLVES_ANIMALS'],
				associations: ['supplementalAnimalInformation']
			}
		},
		'Additional Responsibilities and Funding': {
			duplicate: true,
			areas: {
				columns: [
					'SAFETY_REQUIREMENTS',
					'OTHER_FUNDING_SOURCE',
					'FINANCIAL_SUPPORT_AVAILABLE'
				]
			}
		}
	}
};

export default projectDuplication;

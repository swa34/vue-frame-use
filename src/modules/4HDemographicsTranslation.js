import { recursiveAssign } from '@/modules/utilities';

const contactsTemplate = {
	association: 'contacts',
	identifier: {
		key: 'TYPE_ID'
	},
	key: 'QUANTITY'
};

const racialDemographicsTemplate = {
	association: 'racialDemographics',
	identifier: {
		key: 'RACE_ID'
	}
};

const ethnicityDemographicsTemplate = {
	association: 'ethnicDemographics',
	identifier: {
		key: 'ETHNICITY_ID'
	}
};

const targetAudienceTemplate = {
	association: 'targetAudiences',
	identifier: {
		key: 'TYPE_ID'
	},
	key: 'QUANTITY'
};

const supplementalDataTemplate = {
	association: 'supplementalData',
	identifier: {
		key: 'FIELD_ID'
	},
	key: 'FIELD_VALUE'
};

// const translation = {
// 	CONTACTS: Object.assign({})
// }

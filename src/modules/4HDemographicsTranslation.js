import { recursiveAssign } from '@/modules/utilities';

const contactsTemplate = {
	association: 'contacts',
	identifier: {
		key: 'TYPE_ID'
	},
	key: 'QUANTITY'
};

const subReportContactsTemplate = Object.assign({ subschema: 'subReport' }, contactsTemplate);

const maleTemplate = {
	key: 'QUANTITY_MALE'
};

const femaleTemplate = {
	key: 'QUANTITY_FEMALE'
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

const residenceTemplate = {
	association: 'residenceDemographics',
	identifier: {
		key: 'TYPE_ID'
	},
	key: 'QUANTITY'
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

const racialMaleTemplate = recursiveAssign(maleTemplate, racialDemographicsTemplate);
const racialFemaleTemplate = recursiveAssign(femaleTemplate, racialDemographicsTemplate);
const ethnicMaleTemplate = recursiveAssign(maleTemplate, ethnicityDemographicsTemplate);
const ethnicFemaleTemplate = recursiveAssign(femaleTemplate, ethnicityDemographicsTemplate);

const contacts = {
	faceToFace: 1
};

const races = {
	white: 1,
	black: 2,
	asian: 3,
	indian: 4,
	islander: 5
};

const ethnicities = {
	hispanic: 1
};

const residences = {
	farm: 1,
	rural: 2,
	town: 3,
	suburban: 4,
	city: 5
};

const targetAudiences = {
	preK: 23,
	k3: 24,
	four: 25,
	five: 26,
	six: 27,
	seven: 28,
	eight: 29,
	nine: 30,
	ten: 31,
	eleven: 32,
	twelve: 33,
	collegiate: 34,
	adult: 35,
	staff: 37
};

const suppData = {
	adult: 1,
	volunteer: 2,
	youth: 37,
	military: 35
};

const getIdentifier = (val) => {
	return {
		identifier: {
			value: val
		}
	};
};

const translations = {
	CONTACTS: [
		recursiveAssign(contactsTemplate, getIdentifier(contacts.faceToFace)),
		recursiveAssign(subReportContactsTemplate, getIdentifier(contacts.faceToFace))
	],
	WHITE_MALE: recursiveAssign(racialMaleTemplate, getIdentifier(races.white)),
	WHITE_FEMALE: recursiveAssign(racialFemaleTemplate, getIdentifier(races.white)),
	BLACK_MALE: recursiveAssign(racialMaleTemplate, getIdentifier(races.black)),
	BLACK_FEMALE: recursiveAssign(racialFemaleTemplate, getIdentifier(races.black)),
	ASIAN_MALE: recursiveAssign(racialMaleTemplate, getIdentifier(races.asian)),
	ASIAN_FEMALE: recursiveAssign(racialFemaleTemplate, getIdentifier(races.asian)),
	AMERICAN_INDIAN_MALE: recursiveAssign(racialMaleTemplate, getIdentifier(races.indian)),
	AMERICAN_INDIAN_FEMALE: recursiveAssign(racialFemaleTemplate, getIdentifier(races.indian)),
	PACIFIC_ISLANDER_MALE: recursiveAssign(racialMaleTemplate, getIdentifier(races.islander)),
	PACIFIC_ISLANDER_FEMALE: recursiveAssign(racialFemaleTemplate, getIdentifier(races.islander)),
	HISPANIC_MALE: recursiveAssign(ethnicMaleTemplate, getIdentifier(ethnicities.hispanic)),
	HISPANIC_FEMALE: recursiveAssign(ethnicFemaleTemplate, getIdentifier(ethnicities.hispanic)),
	FARM: recursiveAssign(residenceTemplate, getIdentifier(residences.farm)),
	RURAL: recursiveAssign(residenceTemplate, getIdentifier(residences.rural)),
	TOWN: recursiveAssign(residenceTemplate, getIdentifier(residences.town)),
	SUBURBAN: recursiveAssign(residenceTemplate, getIdentifier(residences.suburban)),
	CITY: recursiveAssign(residenceTemplate, getIdentifier(residences.city)),
	PRE_K: recursiveAssign(targetAudienceTemplate, getIdentifier(targetAudiences.preK)),
	FOUR: recursiveAssign(targetAudienceTemplate, getIdentifier(targetAudiences.four)),
	FIVE: recursiveAssign(targetAudienceTemplate, getIdentifier(targetAudiences.five)),
	SIX: recursiveAssign(targetAudienceTemplate, getIdentifier(targetAudiences.six)),
	SEVEN: recursiveAssign(targetAudienceTemplate, getIdentifier(targetAudiences.seven)),
	EIGHT: recursiveAssign(targetAudienceTemplate, getIdentifier(targetAudiences.eight)),
	NINE: recursiveAssign(targetAudienceTemplate, getIdentifier(targetAudiences.nine)),
	TEN: recursiveAssign(targetAudienceTemplate, getIdentifier(targetAudiences.ten)),
	ELEVEN: recursiveAssign(targetAudienceTemplate, getIdentifier(targetAudiences.eleven)),
	TWELVE: recursiveAssign(targetAudienceTemplate, getIdentifier(targetAudiences.twelve)),
	COLLEGIATE: recursiveAssign(targetAudienceTemplate, getIdentifier(targetAudiences.collegiate)),
	ADULT: recursiveAssign(targetAudienceTemplate, getIdentifier(targetAudiences.adult)),
	UGA_STAFF: recursiveAssign(targetAudienceTemplate, getIdentifier(targetAudiences.staff)),
	TOTAL_ADULT_VOLUNTERS: recursiveAssign(supplementalDataTemplate, getIdentifier(suppData.adult)),
	TOTAL_VOLUNTEER_HOURS: recursiveAssign(supplementalDataTemplate, getIdentifier(suppData.volunteer)),
	TOTAL_YOUTH_VOLUNTEERS: recursiveAssign(supplementalDataTemplate, getIdentifier(suppData.youth)),
	MILITARY_CONTACTS: recursiveAssign(supplementalDataTemplate, getIdentifier(suppData.military)),
	k3Keys: [
		'KINDERGARTEN',
		'ONE',
		'TWO',
		'THREE'
	]
};

export default translations;

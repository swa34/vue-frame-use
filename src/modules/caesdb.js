// import { request } from '@/modules/utilities';
import request from 'superagent';

const apiPrefix = '/rest/gacounts-api/';

const generateURL = str => apiPrefix + str + '.json';

const getActivityLocationTypes = (callback) => {
	const url = generateURL('activityLocationTypes');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getAssociationKeywordTopic = (callback) => {
	const url = generateURL('associationKeywordTopic');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getAssociationReportTypeContactType = (callback) => {
	const url = generateURL('associationReportTypeContactType');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getAssociationReportTypeField = (criteriaStructure, callback) => {
	const url = generateURL('associationReportTypeField');
	request.post(url)
		.send(criteriaStructure)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getAssociationReportTypeProgramArea = (callback) => {
	const url = generateURL('associationReportTypeProgramArea');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getAssociationTargetAudienceProgramArea = (callback) => {
	const url = generateURL('associationTargetAudienceProgramArea');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getAssociationTopicArea = (callback) => {
	const url = generateURL('associationTopicArea');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getContactTypes = (callback) => {
	const url = generateURL('contactTypes');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getCounties = (callback) => {
	const url = generateURL('counties');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getCriteriaStructure = (tablePrefix, callback) => {
	const url = apiPrefix + 'criteriaStructure?TablePrefix=' + tablePrefix;
	request.get(url)
		.end((err, response) => {
			callback(err, JSON.parse(response.text));
		});
};

const getEthnicities = (callback) => {
	const url = generateURL('ethnicities');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getFieldTypes = (callback) => {
	const url = generateURL('fieldTypes');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getGenders = (callback) => {
	const url = generateURL('genders');
	request.get(url)
		.end((err, res) => {
			callback(err, res);
		});
};

const getKeywords = (callback) => {
	const url = generateURL('keywords');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getPlannedPrograms = (criteriaStructure, callback) => {
	const url = generateURL('plannedPrograms');
	request.post(url)
		.send(criteriaStructure)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getProgramScopes = (callback) => {
	const url = generateURL('programScopes');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getProgramAreas = (callback) => {
	const url = generateURL('programAreas');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getRaces = (callback) => {
	const url = generateURL('races');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getReportFields = (callback) => {
	const url = generateURL('reportFields');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getReportTypes = (callback) => {
	const url = generateURL('reportTypes');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getStatePlannedPrograms = (criteriaStructure, callback) => {
	const url = generateURL('statePlannedPrograms');
	request.post(url, criteriaStructure, callback);
};

const getTargetAudiences = (callback) => {
	const url = generateURL('targetAudiences');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

const getTopics = (callback) => {
	const url = generateURL('topics');
	request.get(url)
		.end((err, response) => {
			callback(err, response.body);
		});
};

export {
	getActivityLocationTypes,
	getAssociationKeywordTopic,
	getAssociationReportTypeContactType,
	getAssociationReportTypeField,
	getAssociationReportTypeProgramArea,
	getAssociationTargetAudienceProgramArea,
	getAssociationTopicArea,
	getContactTypes,
	getCounties,
	getCriteriaStructure,
	getEthnicities,
	getFieldTypes,
	getGenders,
	getKeywords,
	getPlannedPrograms,
	getProgramScopes,
	getProgramAreas,
	getRaces,
	getReportFields,
	getReportTypes,
	getStatePlannedPrograms,
	getTargetAudiences,
	getTopics
};

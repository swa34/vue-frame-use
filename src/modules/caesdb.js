import { request } from '@/modules/utilities';

const apiPrefix = '/rest/gacounts-api/';

const generateURL = str => apiPrefix + str + '.json';

const getActivityLocationTypes = (callback) => {
	const url = generateURL('activityLocationTypes');
	request.get(url, callback);
};

const getAssociationKeywordTopic = (callback) => {
	const url = generateURL('associationKeywordTopic');
	request.get(url, callback);
};

const getAssociationReportTypeContactType = (callback) => {
	const url = generateURL('associationReportTypeContactType');
	request.get(url, callback);
};

const getAssociationReportTypeProgramArea = (callback) => {
	const url = generateURL('associationReportTypeProgramArea');
	request.get(url, callback);
};

const getAssociationTopicArea = (callback) => {
	const url = generateURL('associationTopicArea');
	request.get(url, callback);
};

const getContactTypes = (callback) => {
	const url = generateURL('contactTypes');
	request.get(url, callback);
};

const getCounties = (callback) => {
	const url = generateURL('counties');
	request.get(url, callback);
};

const getCriteriaStructure = (tablePrefix, callback) => {
	const url = apiPrefix + 'criteriaStructure?TablePrefix=' + tablePrefix;
	request.get(url, callback);
};

const getKeywords = (callback) => {
	const url = generateURL('keywords');
	request.get(url, callback);
};

const getPlannedPrograms = (criteriaStructure, callback) => {
	const url = generateURL('plannedPrograms');
	request.post(url, criteriaStructure, callback);
};

const getProgramScopes = (callback) => {
	const url = generateURL('programScopes');
	request.get(url, callback);
};

const getProgramAreas = (callback) => {
	const url = generateURL('programAreas');
	request.get(url, callback);
};

const getReportTypes = (callback) => {
	const url = generateURL('reportTypes');
	request.get(url, callback);
};

const getStatePlannedPrograms = (criteriaStructure, callback) => {
	const url = generateURL('statePlannedPrograms');
	request.post(url, criteriaStructure, callback);
};

const getTopics = (callback) => {
	const url = generateURL('topics');
	request.get(url, callback);
};

export {
	getActivityLocationTypes,
	getAssociationKeywordTopic,
	getAssociationReportTypeContactType,
	getAssociationReportTypeProgramArea,
	getAssociationTopicArea,
	getContactTypes,
	getCounties,
	getCriteriaStructure,
	getKeywords,
	getPlannedPrograms,
	getProgramScopes,
	getProgramAreas,
	getReportTypes,
	getStatePlannedPrograms,
	getTopics
};

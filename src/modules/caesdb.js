import request from 'superagent';

const apiPrefix = '/rest/gacounts-api/';

const generateURL = str => apiPrefix + str + '.json';

const serializeByColumns = (obj) => {
	if (!obj.COLUMNS || !obj.DATA) return obj;
	let newArr = [];
	obj.DATA.forEach((item) => {
		let newObj = {};
		item.forEach((field, i) => {
			newObj[obj.COLUMNS[i]] = field;
		});
		newArr.push(newObj);
	});
	return newArr;
};

const makeGetRequest = (url, callback) => {
	if (!window.pendingRequests) {
		window.pendingRequests = 1;
	} else {
		++window.pendingRequests;
	}
	request.get(url)
		.end((err, response) => {
			--window.pendingRequests;
			const data = response.body;
			if (err) {
				callback(err, null);
			} else if (data.Message) {
				callback(new Error(data.Message), null);
			} else {
				callback(null, data);
			}
		});
};

const makePostRequest = (url, dataToSend, callback) => {
	if (!window.pendingRequests) {
		window.pendingRequests = 1;
	} else {
		++window.pendingRequests;
	}
	request.post(url)
		.send(dataToSend)
		.end((err, response) => {
			--window.pendingRequests;
			const data = response.body;
			if (err) {
				callback(err, null);
			} else if (data.Message) {
				callback(new Error(data.Message), null);
			} else {
				callback(null, data);
			}
		});
};

const makeSerializedPostRequest = (url, dataToSend, callback) => {
	if (!window.pendingRequests) {
		window.pendingRequests = 1;
	} else {
		++window.pendingRequests;
	}
	request.post(url)
		.send(dataToSend)
		.end((err, response) => {
			--window.pendingRequests;
			const data = serializeByColumns(response.body);
			if (err) {
				callback(err);
			} else if (data.Message) {
				callback(new Error(data.Message), null);
			} else {
				callback(null, data);
			}
		});
};

const get4HActivity = (activityID, callback) => {
	const url = generateURL('4HActivity');
	makePostRequest(url, activityID, callback);
};

const get4HActivityList = (countyName, callback) => {
	const url = generateURL('4HActivityList');
	makePostRequest(url, countyName, callback);
};

const getActivityLocationTypes = (callback) => {
	const url = generateURL('activityLocationTypes');
	makeGetRequest(url, callback);
};

const getAssociationKeywordTopic = (callback) => {
	const url = generateURL('associationKeywordTopic');
	makeGetRequest(url, callback);
};

const getAssociationReportField = (criteriaStructure, callback) => {
	const url = generateURL('associationReportField');
	makePostRequest(url, criteriaStructure, callback);
};

const getAssociationReportKeyword = (criteriaStructure, callback) => {
	const url = generateURL('associationReportKeyword');
	makePostRequest(url, criteriaStructure, callback);
};

const getAssociationReportProgramArea = (criteriaStructure, callback) => {
	const url = generateURL('associationReportProgramArea');
	makePostRequest(url, criteriaStructure, callback);
};

const getAssociationReportTopic = (criteriaStructure, callback) => {
	const url = generateURL('associationReportTopic');
	makePostRequest(url, criteriaStructure, callback);
};

const getAssociationReportType = (criteriaStructure, callback) => {
	const url = generateURL('associationReportType');
	makePostRequest(url, criteriaStructure, callback);
};

const getAssociationReportTypeContactType = (callback) => {
	const url = generateURL('associationReportTypeContactType');
	makeGetRequest(url, callback);
};

const getAssociationReportTypeField = (criteriaStructure, callback) => {
	const url = generateURL('associationReportTypeField');
	makePostRequest(url, criteriaStructure, callback);
};

const getAssociationReportTypeProgramArea = (callback) => {
	const url = generateURL('associationReportTypeProgramArea');
	makeGetRequest(url, callback);
};

const getAssociationReportTypeRole = (callback) => {
	const url = generateURL('associationReportTypeRole');
	makeGetRequest(url, callback);
};

const getAssociationSubReportField = (criteriaStructure, callback) => {
	const url = generateURL('associationSubReportField');
	makePostRequest(url, criteriaStructure, callback);
};

const getAssociationSubReportRole = (criteriaStructure, callback) => {
	const url = generateURL('associationSubReportRole');
	makePostRequest(url, criteriaStructure, callback);
};

const getAssociationTargetAudienceProgramArea = (callback) => {
	const url = generateURL('associationTargetAudienceProgramArea');
	makeGetRequest(url, callback);
};

const getAssociationTopicArea = (callback) => {
	const url = generateURL('associationTopicArea');
	makeGetRequest(url, callback);
};

const getContactTypes = (callback) => {
	const url = generateURL('contactTypes');
	makeGetRequest(url, callback);
};

const getCounties = (callback) => {
	const url = generateURL('counties');
	makeGetRequest(url, callback);
};

const getCriteriaStructure = (tablePrefix, callback) => {
	if (!tablePrefix) {
		console.error(new Error('Cannot fetch criteria structure: table prefix is undefined'));
		return;
	}
	const url = apiPrefix + 'criteriaStructure?TablePrefix=' + tablePrefix;
	request.get(url)
		.end((err, response) => {
			callback(err, JSON.parse(response.text));
		});
};

const getEthnicDemographic = (criteriaStructure, callback) => {
	const url = generateURL('ethnicDemographic');
	makePostRequest(url, criteriaStructure, callback);
};

const getEthnicities = (callback) => {
	const url = generateURL('ethnicities');
	makeGetRequest(url, callback);
};

const getFieldOptions = (criteriaStructure, callback) => {
	const url = generateURL('fieldOptions');
	makePostRequest(url, criteriaStructure, callback);
};

const getFieldTypes = (callback) => {
	const url = generateURL('fieldTypes');
	makeGetRequest(url, callback);
};

const getGenders = (callback) => {
	const url = generateURL('genders');
	makeGetRequest(url, callback);
};

const getKeywords = (callback) => {
	const url = generateURL('keywords');
	makeGetRequest(url, callback);
};

const getPersonnel = (callback) => {
	const url = generateURL('personnel');
	makeGetRequest(url, callback);
};

const getPlannedPrograms = (criteriaStructure, callback) => {
	const url = generateURL('plannedPrograms');
	makePostRequest(url, criteriaStructure, callback);
};

const getProgramScopes = (callback) => {
	const url = generateURL('programScopes');
	makeGetRequest(url, callback);
};

const getProgramAreas = (callback) => {
	const url = generateURL('programAreas');
	makeGetRequest(url, callback);
};

const getRaces = (callback) => {
	const url = generateURL('races');
	makeGetRequest(url, callback);
};

const getRacialDemographic = (criteriaStructure, callback) => {
	const url = generateURL('racialDemographic');
	makePostRequest(url, criteriaStructure, callback);
};

const getReport = (criteriaStructure, callback) => {
	const url = generateURL('report');
	makePostRequest(url, criteriaStructure, callback);
};

const getReportContact = (criteriaStructure, callback) => {
	const url = generateURL('reportContact');
	makePostRequest(url, criteriaStructure, callback);
};

const getReportFields = (callback) => {
	const url = generateURL('reportFields');
	makeGetRequest(url, callback);
};

const getReportPersonnel = (criteriaStructure, callback) => {
	const url = generateURL('reportPersonnel');
	makePostRequest(url, criteriaStructure, callback);
};

const getReportTargetAudience = (criteriaStructure, callback) => {
	const url = generateURL('reportTargetAudience');
	makePostRequest(url, criteriaStructure, callback);
};

const getReportTypes = (callback) => {
	const url = generateURL('reportTypes');
	makeGetRequest(url, callback);
};

const getResidenceDemographic = (criteriaStructure, callback) => {
	const url = generateURL('residenceDemographic');
	makePostRequest(url, criteriaStructure, callback);
};

const getResidenceTypes = (callback) => {
	const url = generateURL('residenceTypes');
	makeGetRequest(url, callback);
};

const getStatePlannedPrograms = (callback) => {
	const url = generateURL('statePlannedPrograms');
	makeGetRequest(url, callback);
};

const getSubReport = (criteriaStructure, callback) => {
	const url = generateURL('subReport');
	makePostRequest(url, criteriaStructure, callback);
};

const getSubReportContact = (criteriaStructure, callback) => {
	const url = generateURL('subReportContact');
	makePostRequest(url, criteriaStructure, callback);
};

const getSubReportPurposeAchievements = (criteriaStructure, callback) => {
	const url = generateURL('subReportPurposeAchievements');
	makePostRequest(url, criteriaStructure, callback);
};

const getTargetAudiences = (callback) => {
	const url = generateURL('targetAudiences');
	makeGetRequest(url, callback);
};

const getTopics = (callback) => {
	const url = generateURL('topics');
	makeGetRequest(url, callback);
};

export {
	get4HActivity,
	get4HActivityList,
	getActivityLocationTypes,
	getAssociationKeywordTopic,
	getAssociationReportField,
	getAssociationReportKeyword,
	getAssociationReportProgramArea,
	getAssociationReportTopic,
	getAssociationReportType,
	getAssociationReportTypeContactType,
	getAssociationReportTypeField,
	getAssociationReportTypeProgramArea,
	getAssociationReportTypeRole,
	getAssociationSubReportField,
	getAssociationSubReportRole,
	getAssociationTargetAudienceProgramArea,
	getAssociationTopicArea,
	getContactTypes,
	getCounties,
	getCriteriaStructure,
	getEthnicDemographic,
	getEthnicities,
	getFieldOptions,
	getFieldTypes,
	getGenders,
	getKeywords,
	getPersonnel,
	getPlannedPrograms,
	getProgramScopes,
	getProgramAreas,
	getRaces,
	getRacialDemographic,
	getReport,
	getReportContact,
	getReportFields,
	getReportPersonnel,
	getReportTargetAudience,
	getReportTypes,
	getResidenceDemographic,
	getResidenceTypes,
	getStatePlannedPrograms,
	getSubReport,
	getSubReportContact,
	getSubReportPurposeAchievements,
	getTargetAudiences,
	getTopics
};

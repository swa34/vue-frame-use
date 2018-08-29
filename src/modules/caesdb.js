/* global applicationName */
/* global URL */
import prepareForCf from '@/modules/prepareForCf';
import request from 'superagent';
import {
	cfToJs,
	jsToCf
} from '@/modules/criteriaUtils';

const apiPrefix = '/rest/gacounts-api/';

const generateURL = str => apiPrefix + str + '.json';

// const serializeByColumns = (obj) => {
// 	if (!obj.COLUMNS || !obj.DATA) return obj;
// 	let newArr = [];
// 	obj.DATA.forEach((item) => {
// 		let newObj = {};
// 		item.forEach((field, i) => {
// 			newObj[obj.COLUMNS[i]] = field;
// 		});
// 		newArr.push(newObj);
// 	});
// 	return newArr;
// };

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

const makePostRequest = (url, dataToSend, callback, isCriteriaStructure = true) => {
	if (!window.pendingRequests) {
		window.pendingRequests = 1;
	} else {
		++window.pendingRequests;
	}
	request.post(url)
		.send(isCriteriaStructure ? jsToCf(dataToSend) : dataToSend)
		.end((err, response) => {
			--window.pendingRequests;
			const data = response.body;
			if (err || !data) {
				callback(err || new Error('No data returned'), null);
			} else if (data.Message) {
				callback(new Error(data.Message), null);
			} else {
				callback(null, data);
			}
		});
};

// const makeSerializedPostRequest = (url, dataToSend, callback) => {
// 	if (!window.pendingRequests) {
// 		window.pendingRequests = 1;
// 	} else {
// 		++window.pendingRequests;
// 	}
// 	request.post(url)
// 		.send(dataToSend)
// 		.end((err, response) => {
// 			--window.pendingRequests;
// 			const data = serializeByColumns(response.body);
// 			if (err) {
// 				callback(err);
// 			} else if (data.Message) {
// 				callback(new Error(data.Message), null);
// 			} else {
// 				callback(null, data);
// 			}
// 		});
// };

const deleteReport = (reportID, callback) => {
	const url = generateURL('deleteReport');
	makePostRequest(url, { reportID }, callback, false);
};

const get4HActivity = (activityID, callback) => {
	const url = generateURL('4HActivity');
	makePostRequest(url, activityID, callback, false);
};

const get4HActivityList = (countyName, callback) => {
	const url = generateURL('4HActivityList');
	makePostRequest(url, countyName, callback, false);
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

const getContextualHelpMessageHTML = (messageName, callback) => {
	if (!messageName) {
		console.error(new Error('Cannot fetch contextual help message HTML: messageName is undefined.'));
		return;
	}
	const url = apiPrefix + 'contextualHelpMessageHTML?messageName=' + messageName;
	request.get(url)
		.end((err, response) => {
			callback(err, response.text);
		});
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
			callback(err, cfToJs(JSON.parse(response.text)));
		});
};

const getDuplicatedReport = (criteriaStructure, callback) => {
	const url = generateURL('duplicatedReport');
	makePostRequest(url, criteriaStructure, callback);
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

const getMediaDistributed = (criteriaStructure, callback) => {
	const url = generateURL('mediaDistributed');
	makePostRequest(url, criteriaStructure, callback);
};

const getMediaProduction = (criteriaStructure, callback) => {
	const url = generateURL('mediaProduction');
	makePostRequest(url, criteriaStructure, callback);
};

const getMediaReview = (criteriaStructure, callback) => {
	const url = generateURL('mediaReview');
	makePostRequest(url, criteriaStructure, callback);
};

const getMediaReviewType = (callback) => {
	const url = generateURL('mediaReviewType');
	makeGetRequest(url, callback);
};

const getMediaType = (callback) => {
	const url = generateURL('mediaType');
	makeGetRequest(url, callback);
};

const getMediaTypeCategory = (callback) => {
	const url = generateURL('mediaTypeCategory');
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

const logError = (err, dump = {}, trace = null) => {
	const currentUrl = new URL(window.location);
	const errObj = {
		ID: null,
		APPLICATION_ID: 1,
		FIXED_DEVELOPMENT: false,
		FIXED_PRODUCTION: false,
		DATE_CREATED: null,
		DATE_LAST_UPDATED: null,
		BROWSER: navigator.userAgent,
		ERROR_DATETIME: (new Date()).toUTCString(),
		DETAIL: (typeof err === 'string' ? err : JSON.stringify(err)) + (trace ? '\n' + trace : ''),
		ERROR_DIAGNOSTICS: null,
		ERROR_CODE: null,
		EXTENDED_INFO: null,
		HTTP_REFERER: currentUrl.href,
		MAIL_TO: null,
		MESSAGE: null,
		NATIVE_ERROR_CODE: null,
		QUERY_STRING: currentUrl.search,
		REMOTE_ADDRESS: null,
		ERROR_SQLSTATE: null,
		TAG_CONTEXT: null,
		TEMPLATE: currentUrl.pathname,
		TYPE: 'javascript/vue',
		SQL_STATEMENT: null,
		SESSION_DUMP: null,
		URL_DUMP: null,
		FORM_DUMP: null,
		CGI_DUMP: null,
		APPLICATION_DUMP: null,
		REQUEST_DUMP: null
	};
	let url = '/rest/oittools/logError.json';
	if (applicationName) url += `?applicationName=${applicationName}`;
	const callback = (err, data) => {
		if (err) console.error(err);
		console.log(data);
	};
	makePostRequest(url, prepareForCf(errObj), callback, false);
};

const postReportData = (report, callback) => {
	const url = generateURL('processSinglePageReport');
	makePostRequest(url, report, callback, false);
};

const postReportTemplateStatus = (duplicatedReportRecord, callback) => {
	const url = generateURL('modifyReportTemplateStatus');
	makePostRequest(url, duplicatedReportRecord, callback, false);
};

export {
	deleteReport,
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
	getContextualHelpMessageHTML,
	getCounties,
	getCriteriaStructure,
	getDuplicatedReport,
	getEthnicDemographic,
	getEthnicities,
	getFieldOptions,
	getFieldTypes,
	getGenders,
	getKeywords,
	getMediaDistributed,
	getMediaProduction,
	getMediaReview,
	getMediaReviewType,
	getMediaType,
	getMediaTypeCategory,
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
	getTopics,
	logError,
	postReportData,
	postReportTemplateStatus
};

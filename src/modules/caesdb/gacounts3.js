import request from 'superagent';
import {
	generateUrl,
	logError,
	makeGetRequest,
	makePostRequest
} from '@/modules/caesdb';

const apiPrefix = '/rest/gacounts/';

export const deleteReport = (reportID, callback) => {
	const url = generateUrl('deleteReport', apiPrefix);
	makePostRequest(url, { reportID }, callback, false);
};

export const get4HActivity = (activityID, callback) => {
	const url = generateUrl('4HActivity', apiPrefix);
	makePostRequest(url, activityID, callback, false);
};

export const get4HActivityList = (countyName, callback) => {
	const url = generateUrl('4HActivityList', apiPrefix);
	makePostRequest(url, countyName, callback, false);
};

export const getActivityLocationTypes = (callback) => {
	const url = generateUrl('activityLocationTypes', apiPrefix);
	makeGetRequest(url, callback);
};

export const getAssociationKeywordTopic = (callback) => {
	const url = generateUrl('associationKeywordTopic', apiPrefix);
	makeGetRequest(url, callback);
};

export const getAssociationReportField = (criteriaStructure, callback) => {
	const url = generateUrl('associationReportField', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getAssociationReportKeyword = (criteriaStructure, callback) => {
	const url = generateUrl('associationReportKeyword', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getAssociationReportProgramArea = (criteriaStructure, callback) => {
	const url = generateUrl('associationReportProgramArea', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getAssociationReportTopic = (criteriaStructure, callback) => {
	const url = generateUrl('associationReportTopic', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getAssociationReportType = (criteriaStructure, callback) => {
	const url = generateUrl('associationReportType', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getAssociationReportTypeContactType = (callback) => {
	const url = generateUrl('associationReportTypeContactType', apiPrefix);
	makeGetRequest(url, callback);
};

export const getAssociationReportTypeField = (criteriaStructure, callback) => {
	const url = generateUrl('associationReportTypeField', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getAssociationReportTypeProgramArea = (callback) => {
	const url = generateUrl('associationReportTypeProgramArea', apiPrefix);
	makeGetRequest(url, callback);
};

export const getAssociationReportTypeRole = (callback) => {
	const url = generateUrl('associationReportTypeRole', apiPrefix);
	makeGetRequest(url, callback);
};

export const getAssociationSubReportField = (criteriaStructure, callback) => {
	const url = generateUrl('associationSubReportField', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getAssociationSubReportRole = (criteriaStructure, callback) => {
	const url = generateUrl('associationSubReportRole', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getAssociationTargetAudienceProgramArea = (callback) => {
	const url = generateUrl('associationTargetAudienceProgramArea', apiPrefix);
	makeGetRequest(url, callback);
};

export const getAssociationTopicArea = (callback) => {
	const url = generateUrl('associationTopicArea', apiPrefix);
	makeGetRequest(url, callback);
};

export const getContactTypes = (callback) => {
	const url = generateUrl('contactTypes', apiPrefix);
	makeGetRequest(url, callback);
};

export const getContextualHelpMessageHTML = async messageName => {
	if (!messageName) {
		logError(new Error('Cannot fetch contextual help message HTML: messageName is undefined.'));
		return;
	}
	const url = `${apiPrefix}contextualHelpMessageHTML?messageName=${messageName}`;
	try {
		return (await request.get(url)).text;
	} catch (err) {
		logError(err);
	}
};

export const getCounties = (callback) => {
	const url = generateUrl('counties', apiPrefix);
	makeGetRequest(url, callback);
};

export const getDuplicatedReport = (criteriaStructure, callback) => {
	const url = generateUrl('duplicatedReport', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getEthnicDemographic = (criteriaStructure, callback) => {
	const url = generateUrl('ethnicDemographic', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getEthnicities = (callback) => {
	const url = generateUrl('ethnicities', apiPrefix);
	makeGetRequest(url, callback);
};

export const getFieldOptions = (criteriaStructure, callback) => {
	const url = generateUrl('fieldOptions', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getFieldTypes = (callback) => {
	const url = generateUrl('fieldTypes', apiPrefix);
	makeGetRequest(url, callback);
};

export const getGenders = (callback) => {
	const url = generateUrl('genders', apiPrefix);
	makeGetRequest(url, callback);
};

export const getKeywords = (callback) => {
	const url = generateUrl('keywords', apiPrefix);
	makeGetRequest(url, callback);
};

export const getMediaDistributed = (criteriaStructure, callback) => {
	const url = generateUrl('mediaDistributed', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getMediaProduction = (criteriaStructure, callback) => {
	const url = generateUrl('mediaProduction', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getMediaReview = (criteriaStructure, callback) => {
	const url = generateUrl('mediaReview', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getMediaReviewType = (callback) => {
	const url = generateUrl('mediaReviewType', apiPrefix);
	makeGetRequest(url, callback);
};

export const getMediaType = (callback) => {
	const url = generateUrl('mediaType', apiPrefix);
	makeGetRequest(url, callback);
};

export const getMediaTypeCategory = (callback) => {
	const url = generateUrl('mediaTypeCategory', apiPrefix);
	makeGetRequest(url, callback);
};

export const getPersonnel = (callback) => {
	const url = generateUrl('personnel', apiPrefix);
	makeGetRequest(url, callback);
};

export const getPersonnelWithCriteria = (criteriaStructure, callback) => {
	const url = generateUrl('personnelWithCriteria', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getPlannedPrograms = (criteriaStructure, callback) => {
	const url = generateUrl('plannedPrograms', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getProgramScopes = (callback) => {
	const url = generateUrl('programScopes', apiPrefix);
	makeGetRequest(url, callback);
};

export const getProgramAreas = (callback) => {
	const url = generateUrl('programAreas', apiPrefix);
	makeGetRequest(url, callback);
};

export const getRaces = (callback) => {
	const url = generateUrl('races', apiPrefix);
	makeGetRequest(url, callback);
};

export const getRacialDemographic = (criteriaStructure, callback) => {
	const url = generateUrl('racialDemographic', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getReport = (criteriaStructure, callback) => {
	const url = generateUrl('report', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getReportContact = (criteriaStructure, callback) => {
	const url = generateUrl('reportContact', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getReportFields = (callback) => {
	const url = generateUrl('reportFields', apiPrefix);
	makeGetRequest(url, callback);
};

export const getReportPersonnel = (criteriaStructure, callback) => {
	const url = generateUrl('reportPersonnel', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getReportTargetAudience = (criteriaStructure, callback) => {
	const url = generateUrl('reportTargetAudience', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getReportTypes = (callback) => {
	const url = generateUrl('reportTypes', apiPrefix);
	makeGetRequest(url, callback);
};

export const getResidenceDemographic = (criteriaStructure, callback) => {
	const url = generateUrl('residenceDemographic', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getResidenceTypes = (callback) => {
	const url = generateUrl('residenceTypes', apiPrefix);
	makeGetRequest(url, callback);
};

export const getStatePlannedPrograms = (callback) => {
	const url = generateUrl('statePlannedPrograms', apiPrefix);
	makeGetRequest(url, callback);
};

export const getSubReport = (criteriaStructure, callback) => {
	const url = generateUrl('subReport', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getSubReportContact = (criteriaStructure, callback) => {
	const url = generateUrl('subReportContact', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getSubReportPurposeAchievements = (criteriaStructure, callback) => {
	const url = generateUrl('subReportPurposeAchievements', apiPrefix);
	makePostRequest(url, criteriaStructure, callback);
};

export const getTargetAudiences = (callback) => {
	const url = generateUrl('targetAudiences', apiPrefix);
	makeGetRequest(url, callback);
};

export const getTopics = (callback) => {
	const url = generateUrl('topics', apiPrefix);
	makeGetRequest(url, callback);
};

export const postReportData = (report, callback) => {
	const url = generateUrl('processSinglePageReport', apiPrefix);
	makePostRequest(url, report, callback, false);
};

export const postReportTemplateStatus = (duplicatedReportRecord, callback) => {
	const url = generateUrl('modifyReportTemplateStatus', apiPrefix);
	makePostRequest(url, duplicatedReportRecord, callback, false);
};

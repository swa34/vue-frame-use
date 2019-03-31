import request from 'superagent';
import {
	generateUrl,
	logError,
	makeAsyncPostRequest
} from '@/modules/caesdb';

const apiPrefix = '/rest/caesresearchfarmproject/';

const failureMessage = { success: false };

export const getDepartmentHeadCollegeId = async personnelId => {
	window.pendingRequests ? ++window.pendingRequests : window.pendingRequests = 1;
	if (!personnelId) {
		logError(new Error('Cannot get department head: No personnel ID specified.'));
		return;
	}
	const url = `${apiPrefix}departmentsFromPersonnelId.json?personnelId=${personnelId}`;
	try {
		const departments = (await request.get(url)).body;
		if (!departments || departments.length < 1) throw new Error('No departments found');
		if (!departments[0].DEPTHEAD) throw new Error('No department head ID found');
		--window.pendingRequests;
		return departments[0].DEPTHEAD;
	} catch (err) {
		--window.pendingRequests;
		logError(err);
	}
};

export const getProject = async (criteriaStructure, callback) => {
	try {
		const url = generateUrl('project', apiPrefix);
		const data = await makeAsyncPostRequest(url, criteriaStructure);
		callback(null, data);
	} catch (err) {
		callback(err);
	}
};

export const saveProject = async project => {
	// console.log(project);
	console.log(typeof project.project.TREATMENT_LIST_ATTACHMENT_PATH);
	try {
		const url = generateUrl('saveProject', apiPrefix);
		// const data = await makeAsyncPostRequest(url, project, false);
		const data = await request
			.post(url)
			.attach('TREATMENT_LIST_ATTACHMENT_PATH', project.project.TREATMENT_LIST_ATTACHMENT_PATH[0]);
		return data;
	} catch (err) {
		logError(err);
		return failureMessage;
	}
};

export const addComment = async (projectId, statusId, columnName, comment = '') => {
	try {
		const url = generateUrl('addComment', apiPrefix);
		const data = await makeAsyncPostRequest(url, { projectId, statusId, columnName, comment }, false);
		return data;
	} catch (err) {
		logError(err);
		return failureMessage;
	}
};

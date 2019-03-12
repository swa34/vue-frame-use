import request from 'superagent';
import { logError } from '@/modules/caesdb';

export const getDepartmentHeadCollegeId = async personnelId => {
	window.pendingRequests ? ++window.pendingRequests : window.pendingRequests = 1;
	const apiPrefix = '/rest/caesresearchfarmproject/';
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

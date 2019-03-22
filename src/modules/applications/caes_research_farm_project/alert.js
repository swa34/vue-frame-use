export default {
	failedCommentSubmission: (title, messages) => {
		swal({
			type: 'error',
			title: 'Oops!',
			html: `
				<p>
					We were unable to submit your comments, and the ${title} status has
					not been changed due to the following issues:
				</p>
				<div style="text-align: left;">
					${messages}
				</div>
			`.trim()
		});
	},
	failedReject: (title, messages) => {
		swal({
			type: 'error',
			title: 'Oops!',
			html: `
				<p>
					We were unable to mark this ${title}
					as rejected due to the following issues:
				</p>
				<div style="text-align: left;">
					${messages}
				</div>
			`.trim()
		});
	},
	failedReturnForReview: (title, messages) => {
		swal({
			type: 'error',
			title: 'Oops!',
			html: `
				<p>
					This ${title} was unable to be returned to the PI for review due
					to the following issues:
				</p>
				<div style="text-align: left;">
					${messages}
				</div>
			`.trim()
		});
	},
	failedSave: (title, messages, isNew = true) => {
		swal({
			type: 'error',
			title: 'Oops!',
			html: `
				<p>
					Your ${(isNew ? `${title} was` : 'changes were')}
					unable to be saved due to the following issues:
				</p>
				<div style="text-align: left;">
					${messages}
				</div>
			`.trim()
		});
	},
	failedSubmit: (title, messages, isNew = true) => {
		swal({
			type: 'error',
			title: 'Oops!',
			html: `
				<p>
					Your ${(isNew ? `${title} was` : 'changes were')}
					unable to be saved due to the following issues:
				</p>
				<div style="text-align: left;">
					${messages}
				</div>
			`.trim()
		});
	},
	successfulChanges: () => {
		swal('Awesome!', 'Your changes have been saved successfully.', 'success');
	},
	successfulCommentSubmission: (title, projectId, action) => {
		if (['approve', 'returnForReview', 'reject'].indexOf(action) === -1) {
			logError('Invalid action for comment submission alert.');
			return;
		}
		const actionText = {
			approve: 'moved to the next stage of approval',
			returnForReview: 'returned to the PI for review',
			reject: 'marked as rejected'
		};
		swal({
			type: 'success',
			title: 'Awesome!',
			text: `Your comments have been submitted successfully, and the ${title} has been ${actionText[action]}`
		}).then(result => {
			if (result.value) {
				// They clicked OK
				window.location.href = `https://${window.location.hostname}/CAESResearchFarmProject/index.cfm?public=projectForm&pk_id=${projectId}`;
			}
		});
	},
	successfulReject: (title, projectId) => {
		swal({
			type: 'success',
			title: 'Awesome!',
			text: `You have successfully rejected this ${title}.`,
			confirmButtonText: 'OK'
		}).then((result) => {
			if (result.value) {
				// They clicked OK
				window.location.href = `https://${window.location.hostname}/CAESResearchFarmProject/index.cfm?public=projectForm&pk_id=${projectId}`;
			}
		});
	},
	successfulReturnForReview: (title, projectId) => {
		swal({
			type: 'success',
			title: 'Awesome!',
			text: `This ${title} has been successfully returned to the PI for review.`,
			confirmButtonText: 'OK'
		}).then((result) => {
			if (result.value) {
				// They clicked OK
				window.location.href = `https://${window.location.hostname}/CAESResearchFarmProject/index.cfm?public=projectForm&pk_id=${projectId}`;
			}
		});
	},
	successfulSave: (title, projectId) => {
		swal({
			type: 'success',
			title: 'Awesome!',
			text: 'Your ' +  + ' has been saved successfully.',
			confirmButtonText: 'OK'
		}).then((result) => {
			if (result.value) {
				// They clicked OK
				window.location.href = `https://${window.location.hostname}/CAESResearchFarmProject/index.cfm?public=projectForm&pk_id=${projectId}`;
			}
		});
	},
	successfulSubmit: (title, submitter, projectId) => {
		const messages = {
			success: {
				title: 'Awesome!',
				successfulSubmit: {
					approver: `Your ${title} has been submitted successfully and moved to the next stage of approval.`,
					originator: `Your ${title} has been submitted successfully.`
				}
			}
		};
		swal({
			type: 'success',
			title: messages.success.title,
			text: messages.success.successfulSubmit[submitter],
			confirmButtonText: 'OK'
		}).then((result) => {
			if (result.value) {
				// They clicked OK
				window.location.href = `https://${window.location.hostname}/CAESResearchFarmProject/index.cfm?public=projectForm&pk_id=${projectId}`;
			}
		});
	}
};

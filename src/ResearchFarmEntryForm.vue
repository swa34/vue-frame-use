<template lang="html">
	<div>
		<div class="header">
			<h1>Research Farm Project</h1>
			<div class="button-container">
				<button
					v-if="!isNewProject && userHasEditRights"
					type="button"
					class="edit-view-toggle"
					@click="toggleMode"
				>
					{{ mode === 'edit' ? 'View' : 'Edit' }}
				</button>
				<button
					v-if="!isNewProject"
					type="button"
					class="duplication"
					@click="duplicateProject"
				>
					Duplicate
				</button>
				<button
					v-if="!isNewProject && userIsAdmin"
					type="button"
					class="delete"
					@click="removeProject"
				>
					Delete
				</button>
			</div>
		</div>
		<DuplicationModal
			v-if="identifier && identifier.duplicate && !duplication.ready"
			:duplication-schema="duplicationSchema"
		/>
		<p>
			<strong>Research Farm Project Outline and Responsibility</strong>
			<br />
			Land requests for spring/summer projects should be made no later than Feb
			15.  Land requests for fall/winter should be made no later than Aug 1.
		</p>
		<p>
			Please contact Kelly Eisele at (706) 542-2151 with any questions.
		</p>
		<DetailMain
			:schema="schema"
			:mode="mode"
			:identifier="identifier"
			:user-is-owner="userIsOriginator"
			:use-default-submit="false"
		/>
		<hr v-if="mode === 'edit'" />
		<div v-if="mode === 'edit'" class="submit">
			<p>
				By submitting this form, the principal investigator verifies that all
				relevant University Guidelines are being met and project protocols were
				approved by the relevant committees as appropriate (radiological safety,
				biological hazards, animal use).
			</p>
			<div class="button-container">
				<button
					v-if="isNewProject || userIsOriginator"
					type="button"
					class="button"
					@click="saveProjectWithoutSubmitting"
				>
					Save Without Submitting
				</button>
				<button
					v-if="isNewProject || userIsOriginator"
					type="button"
					class="button submit-for-approval"
					@click="submitProject"
				>
					Submit for Approval
				</button>
				<button
					v-if="!isNewProject && (userIsApprover || userIsAdmin)"
					type="button"
					class="button"
					@click="saveProjectWithoutSubmitting"
				>
					Save Without Status Change
				</button>
				<button
					v-if="!isNewProject && (userIsApprover || userIsAdmin)"
					type="button"
					class="button approve"
					@click="submitProject"
				>
					Approve this Project
				</button>
				<button
					v-if="!isNewProject && (userIsApprover || userIsAdmin)"
					type="button"
					class="button needs-review"
					@click="submitProjectForReview"
				>
					Project Needs Revision
				</button>
				<button
					v-if="!isNewProject && (userIsApprover || userIsAdmin)"
					type="button"
					class="button reject"
					@click="rejectProject"
				>
					Reject this Project
				</button>
			</div>
		</div>
	</div>
</template>

<script>
	/* global activeUser */
	/* global activeUserId */
	/* global caesCache */
	import alert from '@/modules/applications/caes_research_farm_project/alert';
	import schema from '@/schemas/caes_research_farm_project/project';
	import dateFormat from 'dateformat';
	import DetailMain from '@/views/DetailMain';
	import DuplicationModal from '@/views/DuplicationModal';
	import projectDuplicationSchema from '@/schemas/caes_research_farm_project/duplication/project';
	import {
		getComputed,
		getStore
	} from '@/modules/store';
	import {
		deepObjectAssign,
		stringFormats,
		url
	} from '@/modules/utilities';
	import { getSortedSchema } from '@/modules/schemaTools';
	import { logError } from '@/modules/caesdb';
	import {
		deleteProject,
		saveProject
	} from '@/modules/caesdb/caes_research_farm_project';
	import {
		getProjectsNextStatusId,
		getProjectsRevisionStatusId,
		statusesIndexedByName
	} from '@/modules/applications/caes_research_farm_project/status-handling';

	export default {
		name: 'ResearchFarmEntryForm',
		components: {
			DetailMain,
			DuplicationModal
		},
		data () {
			return {
				duplicationSchema: projectDuplicationSchema,
				mode: 'edit',
				schema: getSortedSchema(schema),
				statusesIndexedByName
			};
		},
		computed: {
			approvers () {
				return [
					this.STATION_SUPERINTENDENT_PERSONNEL_ID,
					this.DEPARTMENT_HEAD_PERSONNEL_ID,
					this.FINAL_SITE_APPROVER_PERSONNEL_ID,
					this.OFFICE_OF_RESEARCH_PERSONNEL_ID
				];
			},
			duplicateId () {
				return [
					'duplicateId',
					'duplicateID',
					'DUPLICATEID',
					'duplicateid',
					'DuplicateID',
					'DuplicateId',
					'DuPlIcAtEiD'
				].reduce((duplicateId, param) => {
					if (url.getParam(param) !== null) duplicateId = url.getParam(param);
					return duplicateId;
				}, false);
			},
			duplication () {
				return this.$store.state.duplication;
			},
			...getComputed(schema),
			identifier () {
				const key = 'ID';
				const duplicate = this.isDuplicatedProject;
				const value = duplicate ? this.duplicateId : url.getParam('PK_ID') || url.getParam('pk_id');
				if (!value) return false;
				return {
					key,
					duplicate,
					value
				};
			},
			isDuplicatedProject () { return this.duplicateId !== null && this.duplicateId !== false; },
			isNewProject () { return url.getParam('new') !== null || url.getParam('NEW') !== null; },
			projectsNextStatusId () { return getProjectsNextStatusId(this.$store.state.project); },
			userHasEditRights () {
				if (this.userIsOriginator) return true;
				if (Boolean(activeUser.IS_ADMINISTRATOR) === true) return true;
				return this.userIsCurrentApprover;
			},
			userIsAdmin () { return Boolean(activeUser.IS_ADMINISTRATOR); },
			userIsApprover () {
				if (!activeUserId) return false;
				return this.approvers.indexOf(activeUserId) !== -1;
			},
			userIsCurrentApprover () {
				if (!this.STATUS_ID) return false;
				// If they're not the approver, they're not the current one either
				if (!this.userIsApprover) return false;
				console.log('user is at least approver');
				// Find the name of the project's current status
				const indexOfStatusId = caesCache.data.crfp.status.map(s => s.ID).indexOf(this.STATUS_ID);
				if (indexOfStatusId === -1) return false;
				console.log('found index of current status');
				const currentStatusName = caesCache.data.crfp.status[indexOfStatusId].NAME;
				if (!currentStatusName) return false;
				console.log(`found status name: ${currentStatusName}`);

				// Filter the columns down to columns containing extra status/personnel data
				const columnsWithExtraStatus = schema.columns.filter(c => c.extra && c.extra.status);
				// Grab the index of the column for the current pending approver
				const indexOfColumnForPersonnel = columnsWithExtraStatus.map(c => c.extra.status).indexOf(currentStatusName);
				if (indexOfColumnForPersonnel === -1) return false;
				console.log('found index of personnel extra');
				// Grab that personnel id string
				const personnelString = columnsWithExtraStatus[indexOfColumnForPersonnel].extra.personnelColumn;
				// If it's not there, we're in trouble
				if (!personnelString) return false;
				console.log(`found personnel string: ${personnelString}`);
				// Finally, determine whether the current user is that approver
				const isCurrentApprover = this[personnelString] === activeUserId;
				console.log(`is current approver: ${isCurrentApprover}`);
				return isCurrentApprover;
			},
			userIsOriginator () { return this.ORIGINATOR_ID === activeUserId; }
		},
		mounted () {
			// This function will only ever be run once
			if (this.isNewProject) this.initializeNewProject();
			this.setDocumentTitle();
			// Set mode
			if (url.getParam('pk_id')) this.mode = 'view';
		},
		methods: {
			async removeProject () {
				try {
					const response = await deleteProject(this.ID);
					if (response.success) {
						alert.successfulDelete(this.schema.title.toLowerCase());
					} else {
						alert.failedDelete(this.schema.title.toLowerCase(), response.Messages);
					}
				} catch (err) {
					logError(err);
					alert.failedDelete(this.schema.title.toLowerCase(), `<p>Server error.  If the problem persists please contact caesweb@uga.edu.</p>`);
				}
			},
			duplicateProject () {
				window.location.href = `https://${window.location.hostname}/CAESResearchFarmProject/index.cfm?public=projectForm&DuplicateId=${this.ID}`;
			},
			initializeNewProject () {
				this.ORIGINATOR_ID = activeUserId;
				this.mode = 'edit';
			},
			getPreparedStoreForSubmit () {
				const schemaLessStore = deepObjectAssign({}, this.$store.state);
				delete schemaLessStore.schema;
				for (let key in schemaLessStore.project) if (schemaLessStore.project[key] === null) schemaLessStore.project[key] = '';
				schema.associations.map(a => stringFormats.camelCase(a.title)).forEach(association => {
					schemaLessStore[association].records.forEach(record => {
						for (let key in record) if (record[key] === null) record[key] = '';
					});
				});
				// Need to re-add files since they get broken during the deep object assign
				schema.columns.filter(c => c.inputType === 'file').forEach(column => {
					schemaLessStore.project[column.columnName] = this.$store.state.project[column.columnName];
				});
				caesCache.data.crfp.status.filter(status => {
					const approvalStatusNames = [
						'Pending Superintendent Approval',
						'Pending Department Head Approval',
						'Pending Final Site Approver Approval',
						'Pending Office of Associate Dean of Research Approval'
					];
					return approvalStatusNames.indexOf(status.NAME) !== -1;
				}).forEach(status => {
					const approvalDateString = status.NAME
						.replace(/^Pending (Superintendent|Department Head|Final Site Approver|Office of)(?: Approval| Associate Dean of )(Research)?.*/, '$1 $2')
						.trim()
						.toUpperCase()
						.replace(/ /g, '_') + '_APPROVAL_DATE';
					if (schemaLessStore.project.STATUS_ID === status.ID) {
						const now = new Date();
						schemaLessStore.project[approvalDateString] = dateFormat(now, 'isoDateTime');
					}
				});
				return schemaLessStore;
			},
			async rejectProject () {
				const projectBlob = this.getPreparedStoreForSubmit();
				projectBlob.project.STATUS_ID = this.statusesIndexedByName['Rejected'];
				let response = await saveProject(projectBlob);
				response = await response.body;
				if (response.SUCCESS) {
					alert.successfulReject(this.schema.title.toLowerCase(), response.PROJECT_ID);
				} else {
					alert.failedReject(this.schema.title.toLowerCase(), response.MESSAGES);
				}
			},
			async saveProjectWithoutSubmitting () {
				const projectBlob = this.getPreparedStoreForSubmit();
				if ((this.isNewProject || this.userIsOriginator || !projectBlob.project.STATUS_ID) && !this.userIsApprover) {
					const indexOfStatus = caesCache.data.crfp.status.map(s => s.NAME).indexOf('Saved Without Submission');
					if (indexOfStatus === -1) {
						logError('Unable to save project.  Unable to set status for saving without submission.');
						return;
					}
					projectBlob.project.STATUS_ID = caesCache.data.crfp.status[indexOfStatus].ID;
				}
				let response = await saveProject(projectBlob);
				response = await response.body;
				if (response.SUCCESS) {
					if (this.isNewProject) {
						alert.successfulSave(this.schema.title.toLowerCase(), response.PROJECT_ID);
					} else {
						alert.successfulChanges(response.PROJECT_ID);
					}
				} else {
					alert.failedSave(this.schema.title.toLowerCase(), response.MESSAGES, this.isNewProject);
				}
			},
			setDocumentTitle () {
				if (this.isNewProject && this.isDuplicatedProject) {
					document.title = `Duplicate Research Farm Project | ${document.title}`;
				} else if (this.isNewProject) {
					document.title = `New Research Farm Project | ${document.title}`;
				} else if (this.mode === 'edit') {
					document.title = `Research Farm Project | ${document.title}`;
				} else {
					document.title = `View Research Farm Project | ${document.title}`;
				}
			},
			async submitProject () {
				const projectBlob = this.getPreparedStoreForSubmit();
				projectBlob.project.STATUS_ID = this.projectsNextStatusId;
				let response = await saveProject(projectBlob);
				const submitter = this.userIsOriginator ? 'originator' : 'approver';
				response = await response.body;
				if (response.SUCCESS) {
					alert.successfulSubmit(this.schema.title.toLowerCase(), submitter, response.PROJECT_ID);
				} else {
					alert.failedSubmit(this.schema.title.toLowerCase(), response.MESSAGES, this.isNewProject);
				}
			},
			async submitProjectForReview () {
				const projectBlob = this.getPreparedStoreForSubmit();
				projectBlob.project.STATUS_ID = getProjectsRevisionStatusId(projectBlob.project);
				let response = await saveProject(projectBlob);
				response = await response.body;
				if (response.SUCCESS) {
					alert.successfulReturnForReview(this.schema.title.toLowerCase(), response.PROJECT_ID);
				} else {
					alert.failedReturnForReview(this.schema.title.toLowerCase(), response.MESSAGES);
				}
			},
			toggleMode () { this.mode === 'edit' ? this.mode = 'view' : this.mode = 'edit'; }
		},
		store: getStore(schema, !url.getParam('key') || (url.getParam('key') && !url.getParam('value')))
	};
</script>

<style lang="scss" scoped>
	$red: #6c3129;
	div.header {
		display: flex;
		justify-content: space-between;
		align-items: stretch;
		h1 { align-self: center; }
		div.button-container {
			button.delete { background: $red; }
		}
		@media screen and (max-width: 1080px) {
			display: block;
			h1 { margin-bottom: .5rem; }
			button[type="button"] {
				padding: .5rem;
				margin: 0;
			}
		}
	}
	div.submit {
		div.button-container {
			display: flex;
			justify-content: center;
			button {
				margin-right: .5rem;
				&.submit-for-approval, &.approve { background: #406242; }
				&.needs-review { background: #f7b538; color: #000; }
				&.reject, &.delete { background: $red; }
			}
		}
	}
</style>

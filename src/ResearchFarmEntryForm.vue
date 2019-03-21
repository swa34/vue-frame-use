<template lang="html">
	<div>
		<h1>Research Farm Project</h1>
		<div class="button-container">
			<button v-if="!isNewProject && userHasEditRights" type="button" class="edit-view-toggle" @click="toggleMode">
				{{ mode === 'edit' ? 'View' : 'Edit' }}
			</button>
			<button v-if="!isNewProject" type="button" class="duplication" @click="duplicateProject">
				Duplicate
			</button>
		</div>
		<DuplicationModal
			v-if="identifier && identifier.duplicate && !duplication.ready"
			:duplicationSchema="duplicationSchema"
		/>
		<DetailMain
			:schema="schema"
			:mode="mode"
			:identifier="identifier"
			:userIsOwner="userIsOriginator"
			:useDefaultSubmit="false"
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
				<button type="button" class="button" @click="saveProjectWithoutSubmitting">
					Save Without Submitting
				</button>
				<button v-if="userIsOriginator || userIsAdmin" type="button" class="button submit-for-approval" @click="submitProject">
					Submit for Approval
				</button>
				<button v-if="userIsApprover || userIsAdmin" type="button" class="button approve" @click="submitProject">
					Approve this Project
				</button>
				<button v-if="userIsApprover || userIsAdmin" type="button" class="button needs-review" @click="submitProjectForReview">
					Project Needs Revision
				</button>
				<button v-if="userIsApprover || userIsAdmin" type="button" class="button reject" @click="rejectProject">
					Reject this Project
				</button>
			</div>
		</div>
	</div>
</template>

<script>
	/* global activeUserId */
	/* global swal */
	import schema from '@/schemas/caes_research_farm_project/project';
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
	import {
		addComment,
		saveProject
	} from '@/modules/caesdb/caes_research_farm_project';

	export default {
		name: 'ResearchFarmEntryForm',
		components: {
			DetailMain,
			DuplicationModal
		},
		data () {
			return {
				duplicationSchema: projectDuplicationSchema,
				mode: 'view',
				schema: getSortedSchema(schema)
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
			projectsNextStatusId () {
				const currentStatus = this.$store.state.project.STATUS_ID;
				const statusesIndexedById = caesCache.data.crfp.status.reduce((newIndex, status) => {
					newIndex[status.ID] = status.NAME;
					return newIndex;
				}, {});
				const stage = {
					null: 0,
					undefined: 0,
					'Saved Without Submission': 0,
					'Pending PI Review of Department Head Comments': 0,
				  'Pending PI Review of Superintendent Comments': 0,
				  'Pending PI Review of Final Site Approver Comments': 0,
				  'Pending PI Review of Office of Associate Dean of Research Comments': 0,
					'Pending Superintendent Approval': 1,
					'Pending Department Head Approval': 2,
					'Pending Final Site Approver Approval': 3,
					'Pending Office of Associate Dean of Research Approval': 4,
					'Approved': 5,
					'Rejected': 5
				}[statusesIndexedById[currentStatus]];
				const statusMap = caesCache.data.crfp.status.reduce((map, status) => {
					if (stage < 1 && this.SUPERINTENDENT_PERSONNEL_ID !== null) {
						map[status.ID] = this.statusesIndexedByName['Pending Superintendent Approval'];
					} else if (stage < 2 && this.DEPARTMENT_HEAD_PERSONNEL_ID !== null) {
						map[status.ID] = this.statusesIndexedByName['Pending Department Head Approval'];
					} else if (stage < 3 && this.FINAL_SITE_APPROVER_PERSONNEL_ID !== null) {
						map[status.ID] = this.statusesIndexedByName['Pending Final Site Approver Approval'];
					} else if (stage < 4 && this.OFFICE_OF_RESEARCH_PERSONNEL_ID !== null) {
						map[status.ID] = this.statusesIndexedByName['Pending Office of Associate Dean of Research Approval'];
					} else if (stage < 5) {
						map[status.ID] = this.statusesIndexedByName['Approved'];
					} else {
						map[status.ID] = -1;
					}
					return map;
				}, {});

				return statusMap[currentStatus];
			},
			statusesIndexedByName () {
				return caesCache.data.crfp.status.reduce((newIndex, status) => {
					newIndex[status.NAME] = status.ID;
					return newIndex;
				}, {});
			},
			userHasEditRights () {
				if (this.userIsOriginator) return true;
				if (Boolean(activeUser.IS_ADMINISTRATOR)) return true;
				return this.approvers.indexOf(activeUserId) !== -1;
			},
			userIsAdmin () {
				return Boolean(activeUser.IS_ADMINISTRATOR);
			},
			userIsApprover () {
				if (!activeUserId) return false;
				return this.approvers.indexOf(activeUserId) !== -1;
			},
			userIsOriginator () { return this.ORIGINATOR_ID === activeUserId; }
		},
		mounted () {
			// This function will only ever be run once
			if (this.isNewProject) this.initializeNewProject();
			this.setDocumentTitle();
		},
		methods: {
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
				return schemaLessStore;
			},
			async rejectProject () {
				const projectBlob = this.getPreparedStoreForSubmit();
				projectBlob.project.STATUS_ID = this.statusesIndexedByName['Rejected'];
				const response = await saveProject(projectBlob);
				if (response.SUCCESS) {
					swal({
						type: 'success',
						title: 'Awesome!',
						text: `You have successfully rejected this ${this.schema.title.toLowerCase()}.`,
						confirmButtonText: 'OK'
					}).then((result) => {
						if (result.value) {
							// They clicked OK
							window.location.href = `https://${window.location.hostname}/CAESResearchFarmProject/index.cfm?public=projectForm&pk_id=${response.PROJECT_ID}`;
						}
					});
				} else {
					swal({
						type: 'error',
						title: 'Oops!',
						html: `
							<p>
								We were unable to mark this ${this.schema.title.toLowerCase()}
								as rejected due to the following issues:
							</p>
							<div style="text-align: left;">
								${response.MESSAGES}
							</div>
						`.trim()
					});
				}
			},
			async saveProjectWithoutSubmitting () {
				const projectBlob = this.getPreparedStoreForSubmit();
				if (this.isNewProject) {
					const indexOfStatus = caesCache.data.crfp.status.map(s => s.NAME).indexOf('Saved Without Submission');
					if (indexOfStatus === -1) {
						logError('Unable to save project.  Unable to set status for saving without submission.');
						return;
					}
					projectBlob.project.STATUS_ID = caesCache.data.crfp.status[indexOfStatus].ID;
				}
				const response = await saveProject(projectBlob);
				if (response.SUCCESS) {
					if (this.isNewProject) {
						swal({
							type: 'success',
							title: 'Awesome!',
							text: 'Your ' + this.schema.title.toLowerCase() + ' has been saved successfully.',
							confirmButtonText: 'OK'
						}).then((result) => {
							if (result.value) {
								// They clicked OK
								window.location.href = `https://${window.location.hostname}/CAESResearchFarmProject/index.cfm?public=projectForm&pk_id=${response.PROJECT_ID}`;
							}
						});
					} else {
						swal('Awesome!', 'Your changes have been saved successfully.', 'success');
					}
				} else {
					swal({
						type: 'error',
						title: 'Oops!',
						html: `
							<p>
								Your ${(this.isNewProject ? `${this.schema.title.toLowerCase()} was` : 'changes were')}
								unable to be saved due to the following issues:
							</p>
							<div style="text-align: left;">
								${response.MESSAGES}
							</div>
						`.trim()
					});
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
				const response = await saveProject(projectBlob);
				const submitter = this.userIsOriginator ? 'originator' : 'approver';
				const messages = {
					success: {
						title: 'Awesome!',
						successfulSubmit: {
							approver: `Your ${this.schema.title.toLowerCase()} has been submitted successfully and moved to the next stage of approval.`,
							originator: `Your ${this.schema.title.toLowerCase()} has been submitted successfully.`
						}
					}
				};
				if (response.SUCCESS) {
					swal({
						type: 'success',
						title: messages.success.title,
						text: messages.success.successfulSubmit[submitter],
						confirmButtonText: 'OK'
					}).then((result) => {
						if (result.value) {
							// They clicked OK
							window.location.href = `https://${window.location.hostname}/CAESResearchFarmProject/index.cfm?public=projectForm&pk_id=${response.PROJECT_ID}`;
						}
					});
				} else {
					swal({
						type: 'error',
						title: 'Oops!',
						html: `
							<p>
								Your ${(this.isNewProject ? `${this.schema.title.toLowerCase()} was` : 'changes were')}
								unable to be saved due to the following issues:
							</p>
							<div style="text-align: left;">
								${response.MESSAGES}
							</div>
						`.trim()
					});
				}
			},
			async submitProjectForReview () {
				const projectBlob = this.getPreparedStoreForSubmit();
				projectBlob.project.STATUS_ID = caesCache.data.crfp.status.map(status => {
					if (status.NAME === 'Pending Superintendent Approval') {
						return this.statusesIndexedByName['Pending PI Review of Superintendent Comments'];
					} else if (status.NAME === 'Pending Department Head Approval') {
						return this.statusesIndexedByName['Pending PI Review of Department Head Comments'];
					} else if (status.NAME === 'Pending Final Site Approver Approval') {
						return this.statusesIndexedByName['Pending PI Review of Final Site Approver Comments'];
					} else if (status.NAME === 'Pending Office of Associate Dean of Research Approval') {
						return this.statusesIndexedByName['Pending PI Review of Office of Associate Dean of Research Comments'];
					} else {
						return status;
					}
				})[caesCache.data.crfp.status.map(s => s.ID).indexOf(projectBlob.project.STATUS_ID)];
				const response = await saveProject(projectBlob);
				if (response.SUCCESS) {
					swal({
						type: 'success',
						title: 'Awesome!',
						text: `This ${this.schema.title.toLowerCase()} has been successfully returned to the PI for review.`,
						confirmButtonText: 'OK'
					}).then((result) => {
						if (result.value) {
							// They clicked OK
							window.location.href = `https://${window.location.hostname}/CAESResearchFarmProject/index.cfm?public=projectForm&pk_id=${response.PROJECT_ID}`;
						}
					});
				} else {
					swal({
						type: 'error',
						title: 'Oops!',
						html: `
							<p>
								This project was unable to be returned to the PI for review due
								to the following issues:
							</p>
							<div style="text-align: left;">
								${response.MESSAGES}
							</div>
						`.trim()
					});
				}
			},
			toggleMode () { this.mode === 'edit' ? this.mode = 'view' : this.mode = 'edit'; }
		},
		store: getStore(schema, !url.getParam('key') || (url.getParam('key') && !url.getParam('value')))
	};
</script>

<style lang="scss" scoped>
	div.submit {
		div.button-container {
			display: flex;
			justify-content: center;
			button {
				margin-right: .5rem;
				&.submit-for-approval { background: #406242; }
			}
		}
	}
</style>

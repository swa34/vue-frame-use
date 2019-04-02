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
		<pre>{{ JSON.stringify($store.state.supplementalAnimalInformation, null, 2) }}</pre>
		<pre>{{ JSON.stringify($store.state.supplementalPlantInformation, null, 2) }}</pre>
	</div>
</template>

<script>
	/* global activeUserId */
	/* global swal */
	import alert from '@/modules/applications/caes_research_farm_project/alert';
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
				mode: 'view',
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
				// Need to re-add files since they get broken during the deep object assign
				schema.columns.filter(c => c.inputType === 'file').forEach(column => {
					schemaLessStore.project[column.columnName] = this.$store.state.project[column.columnName];
				});
				return schemaLessStore;
			},
			async rejectProject () {
				const projectBlob = this.getPreparedStoreForSubmit();
				projectBlob.project.STATUS_ID = this.statusesIndexedByName['Rejected'];
				const response = await saveProject(projectBlob);
				if (response.SUCCESS) {
					alert.successfulReject(this.schema.title.toLowerCase(), response.PROJECT_ID);
				} else {
					alert.failedReject(this.schema.title.toLowerCase, response.MESSAGES);
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
						alert.successfulSave(this.schema.title.toLowerCase(), response.PROJECT_ID);
					} else {
						alert.successfulChanges();
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
				console.log(projectBlob.project);
				let response = await saveProject(projectBlob);
				const submitter = this.userIsOriginator ? 'originator' : 'approver';
				console.log(response);
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
				const response = await saveProject(projectBlob);
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
	div.submit {
		div.button-container {
			display: flex;
			justify-content: center;
			button {
				margin-right: .5rem;
				&.submit-for-approval, &.approve { background: #406242; }
				&.needs-review { background: #f7b538; color: #000; }
				&.reject { background: #6c3129; }
			}
		}
	}
</style>

<template lang="html">
	<div v-if="personnel.length > 0">
		<div>
			<h3>
				Report Owner - {{ getPersonnelNameFromID(ownerID) }}
			</h3>
			<div v-if="editMode === 'owner'">
				<!-- Planned Programs -->
				<div>
					<label>
						<h4>
							Type of Issue
						</h4>
						<select v-model="ownerState.issueType">
							<option value="local">
								Local
							</option>
							<option value="state">
								State
							</option>
						</select>
					</label>
					<label v-if="ownerState.issueType === 'local'">
						<h4>
							Local Issue
						</h4>
						<select v-if="ownerState.plannedPrograms.length > 0" v-model="ownerSubReport.PLANNED_PROGRAM_ID">
							<option v-for="program in ownerState.plannedPrograms" :value="program.ID">
								{{ program.NAME }}
							</option>
						</select>
						<p v-else>
							<em>
								There are no local issues associated with your account.
							</em>
						</p>
					</label>
					<label v-else-if="ownerState.issueType === 'state'">
						<h4>
							State Issue
						</h4>
						<select v-if="statePlannedPrograms.length > 0" v-model="ownerSubReport.STATE_PLANNED_PROGRAM_ID">
							<option v-for="program in statePlannedPrograms" :value="program.ID">
								{{ program.NAME }}
							</option>
						</select>
					</label>
				</div>
				<!-- Roles -->
				<div>
					<h4>
						Roles
					</h4>
					<ul v-if="reportType !== -1" class="checkbox">
						<li v-for="role in ownerRoleTypes">
							<label>
								<input type="checkbox" :value="generateRoleRecord(role)" v-model="ownerRoles" />
								<span>
									{{ role.SUB_REPORT_ROLE_LABEL }}
								</span>
							</label>
						</li>
					</ul>
				</div>
				<!-- Contacts -->
				<table v-if="ownerContacts.length > 0">
					<caption>
						Contacts
					</caption>
					<thead>
						<tr>
							<th>
								Contact Type
							</th>
							<th>
								Quantity
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="contact in ownerContacts">
							<td>
								{{ getContactLabelFromID(contact.TYPE_ID) }}
							</td>
							<td>
								<input type="number" v-model.number="contact.QUANTITY" min="0" />
							</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td>
								Total
							</td>
							<td>
								{{ sum(ownerContacts, 'QUANTITY') }}
							</td>
						</tr>
					</tfoot>
				</table>
				<!-- Supplemental Data -->
				<SupplementalData
					:forSubReport="true"
				/>
				<!-- Outcome, Impact, Achievements -->
				<div>
					<label>
						<h4>
							Outcome, Impact, and Achievements
						</h4>
						<div v-for="outcome in ownerOutcomes">
							<textarea v-model="outcome.MEMO"></textarea>
						</div>
					</label>
				</div>
			</div>
			<div v-else-if="editMode === 'collaborator'">

			</div>
			<div v-else>

			</div>
		</div>
		<div>
			<h3>
				Collaborators
			</h3>
			<div v-for="collaborator in collaborators" v-if="collaborator.PERSONNEL_ID !== ownerID" class="outlined">
				<h4>
					{{ getPersonnelNameFromID(collaborator.PERSONNEL_ID) }}
				</h4>
				<p v-if="!collaborator.HAS_REPORTED || collaborator.HAS_REPORTED !== 1">
					<em>
						No sub-report filed.
					</em>
				</p>
				<SubReportPlainText
					v-else
					:data="getCollaboratorSubReportDataFromID(collaborator.PERSONNEL_ID)"
				/>
			</div>
			<div>
				<fieldset>
					<h4>
						Add Collaborator
					</h4>
					<FuzzySelect
						v-model="newCollaborator.PERSONNEL_ID"
						:options="personnelForFuzzySelect"
					/>
					<button v-on:click="addCollaborator" type="button" class="button">
						Add
					</button>
				</fieldset>
			</div>
		</div>
	</div>
</template>

<script>
	/* global activeUserID */
	import FuzzySelect from '@/views/elements/FuzzySelect';
	import SubReportPlainText from '@/views/custom/gacounts3/SubReportPlainText';
	import SupplementalData from '@/views/custom/gacounts3/SupplementalData';
	import {
		getAssociationReportTypeContactType,
		getAssociationReportTypeRole,
		getAssociationSubReportRole,
		getContactTypes,
		getCriteriaStructure,
		getPersonnel,
		getPlannedPrograms,
		getReportPersonnel,
		getStatePlannedPrograms,
		getSubReport,
		getSubReportContact,
		getSubReportPurposeAchievements
	} from '@/modules/caesdb';
	import {
		cfToJs,
		filter,
		jsToCf
	} from '@/modules/criteriaUtils';
	import { url } from '@/modules/utilities';

	export default {
		name: 'SubReportCollaborators',
		components: {
			FuzzySelect,
			SubReportPlainText,
			SupplementalData
		},
		computed: {
			allSubReportIDs () {
				let subReportIDs = this.collaboratorRecords.subReports.map(r => r.ID);
				subReportIDs.push(this.ownerSubReport.ID);
				return subReportIDs;
			},
			collaborators: {
				get () {
					return this.$store.state.collaborators.records;
				},
				set (val) {
					this.$store.state.collaborators.records = val;
				}
			},
			ownerContacts: {
				get () {
					return this.$store.state.subschemas.subReport.contacts.records;
				},
				set (val) {
					this.$store.state.subschemas.subReport.contacts.records = val;
				}
			},
			ownerCriteriaStructures () {
				const critStructs = {
					associationReportTypeContactType: Object.assign({}, this.criteriaStructureTemplates.associationReportTypeContactType),
					associationReportTypeRole: Object.assign({}, this.criteriaStructureTemplates.associationReportTypeRole)
				};
				critStructs.associationReportTypeContactType.criteria_REPORT_TYPE_ID_eq.push(this.reportType);
				critStructs.associationReportTypeRole.criteria_TYPE_ID_eq.push(this.reportType);
				return critStructs;
			},
			ownerID () { return this.$store.state.report.OWNER_ID || activeUserID; },
			ownerOutcomes: {
				get () {
					return this.$store.state.subschemas.subReport.outcomeImpactAndAchievements.records;
				},
				set (val) {
					this.$store.state.subschemas.subReport.outcomeImpactAndAchievements.records = val;
				}
			},
			ownerRoles: {
				get () {
					return this.$store.state.subschemas.subReport.roles.records;
				},
				set (val) {
					this.$store.state.subschemas.subReport.roles.records = val;
				}
			},
			ownerRoleTypes () {
				return filter(this.ownerState.unfilteredRoleTypes, this.ownerCriteriaStructures.associationReportTypeRole);
			},
			ownerSubReport: {
				get () {
					return this.$store.state.subschemas.subReport.subReport;
				},
				set (val) {
					this.$store.state.subschemas.subReport.subReport = val;
				}
			},
			ownerSupplementalData: {
				get () {
					return this.$store.state.subschemas.subReport.supplementalData.records;
				},
				set (val) {
					this.$store.state.subschemas.subReport.supplementalData.records = val;
				}
			},
			personnelForFuzzySelect () {
				return this.personnel.map((personnel) => {
					return {
						key: personnel.ID,
						label: [personnel.FIRST_NAME, personnel.MIDDLE_NAME, personnel.LAST_NAME].join(' ')
					};
				});
			},
			reportContacts () { return this.$store.state.contacts.records; },
			reportID () { return this.$store.state.report.ID; },
			reportType () {
				const reportTypeRecords = this.$store.state.reportType.records;
				return reportTypeRecords.length > 0 ? reportTypeRecords[0].TYPE_ID : -1;
			}
		},
		data () {
			const data = {
				activeUserID,
				collaboratorRecords: {
					contacts: [],
					outcomes: [],
					plannedPrograms: [],
					roles: [],
					subReports: [],
					supplementalData: []
				},
				contactTypes: [],
				criteriaStructureTemplates: {},
				editMode: 'owner',
				newCollaborator: {
					REPORT_ID: this.reportID || null,
					PERSONNEL_ID: null,
					IS_REJECTED: false
				},
				ownerState: {
					issueType: 'local',
					plannedPrograms: [],
					unfilteredRoleTypes: []
				},
				personnel: [],
				statePlannedPrograms: []
			};

			return data;
		},
		methods: {
			addCollaborator () {
				this.collaborators.push(Object.assign({}, this.newCollaborator));
				this.newCollaborator = {};
			},
			getCollaboratorPlannedProgramFromID (id) {
				const collabProgramsMap = this.collaboratorRecords.plannedPrograms.map(p => p.ID);
				const index = collabProgramsMap.indexOf(id);
				if (index === -1) return {};
				return this.collaboratorRecords.plannedPrograms[index];
			},
			getCollaboratorSubReportDataFromID (id) {
				const data = {
					contacts: [],
					outcomes: [],
					roles: [],
					subReport: {}
				};
				this.collaboratorRecords.subReports.forEach((subReport) => {
					if (subReport.USER_ID === id) data.subReport = subReport;
				});
				this.collaboratorRecords.contacts.forEach((contact) => {
					if (contact.SUB_REPORT_ID === data.subReport.ID) data.contacts.push(contact);
				});
				this.collaboratorRecords.outcomes.forEach((outcome) => {
					if (outcome.USER_ID === id) data.outcomes.push(outcome);
				});
				this.collaboratorRecords.roles.forEach((role) => {
					if (role.SUB_REPORT_ID === data.subReport.ID) data.roles.push(role);
				});
				if (data.subReport.STATE_PLANNED_PROGRAM_ID) data.subReport.statePlannedPorgram = this.getStatePlannedProgramFromID(data.subReport.STATE_PLANNED_PROGRAM_ID);
				if (data.subReport.PLANNED_PROGRAM_ID) data.subReport.plannedProgram = this.getCollaboratorPlannedProgramFromID(data.subReport.PLANNED_PROGRAM_ID);
				return data;
			},
			getContactLabelFromID (id) {
				const index = this.contactTypes.map(t => t.ID).indexOf(id);
				if (index === -1) return '';
				return this.contactTypes[index].LABEL;
			},
			getPersonnelNameFromID (id) {
				let index = this.personnel.map(p => p.ID).indexOf(id);
				if (index === -1) return 'Unknown';
				const personnel = this.personnel[index];
				return [personnel.FIRST_NAME, personnel.MIDDLE_NAME, personnel.LAST_NAME].join(' ');
			},
			getStatePlannedProgramFromID (id) {
				let statePlannedProgram = {};
				this.statePlannedPrograms.forEach((program) => {
					if (program.ID === id) statePlannedProgram = program;
				});

				return statePlannedProgram;
			},
			generateRoleRecord (role) {
				return {
					SUB_REPORT_ID: this.ownerSubReport.ID || null,
					ROLE_ID: role.ROLE_ID
				};
			},
			populateOwnerContactsRecords () {
				if (this.reportContacts.length > 0) {
					const contacts = [];
					this.reportContacts.forEach((record) => {
						let newRecord = Object.assign({}, record);
						delete newRecord.REPORT_ID;
						newRecord.SUB_REPORT_ID = this.ownerSubReport.ID || null;
						newRecord.QUANTITY = null;
						contacts.push(newRecord);
					});
					this.ownerContacts = contacts;
				} else if (this.ownerContacts.length < 1) {
					getAssociationReportTypeContactType((err, data) => {
						if (err) console.error(err);
						if (data) {
							data.forEach((record) => {
								if (record.REPORT_TYPE_ID === this.reportType) {
									this.ownerContacts.push({
										SUB_REPORT_ID: this.ownerSubReport.ID || null,
										TYPE_ID: record.CONTACT_TYPE_ID,
										QUANTITY: null
									});
								}
							});
						}
					});
				}
			},
			populateOwnerOutcomeRecord () {
				this.ownerOutcomes.push({
					ID: null,
					REPORT_ID: null,
					USER_ID: null,
					MEMO: null,
					DATE_CREATED: null
				});
			},
			sum (objArr, key) {
				let sum = 0;
				objArr.forEach((obj) => {
					sum += Number(obj[key]);
				});
				return sum;
			}
		},
		mounted () {
			const fetchCriteriaStructures = () => {
				getCriteriaStructure('FPW_PLANNED_PROGRAM', (err, data) => {
					if (err) console.error(err);
					if (data) {
						this.criteriaStructureTemplates.plannedProgram = cfToJs(data);
					}
				});

				getCriteriaStructure('GC3_ASSOCIATION_REPORT_TYPE_CONTACT_TYPE', (err, data) => {
					if (err) console.error(err);
					if (data) {
						this.criteriaStructureTemplates.associationReportTypeContactType = cfToJs(data);
					}
				});

				getCriteriaStructure('GC3_ASSOCIATION_REPORT_TYPE_ROLE', (err, data) => {
					if (err) console.error(err);
					if (data) {
						this.criteriaStructureTemplates.associationReportTypeRole = cfToJs(data);
					}
				});
			};

			const fetchCollaboratorPlannedPrograms = () => {
				const critStruct = Object.assign({}, this.criteriaStructureTemplates.plannedProgram);
				this.collaboratorRecords.subReports.forEach((subReport) => {
					if (subReport.PLANNED_PROGRAM_ID && critStruct.criteria_ID_eq.indexOf(subReport.PLANNED_PROGRAM_ID) === -1) critStruct.criteria_ID_eq.push(subReport.PLANNED_PROGRAM_ID);
				});
				getPlannedPrograms(jsToCf(critStruct), (err, data) => {
					if (err) console.error(err);
					if (data) {
						this.collaboratorRecords.plannedPrograms = data;
					}
				});
			};

			const fetchCollaborators = () => {
				getCriteriaStructure('GC3_REPORT_PERSONNEL', (err, data) => {
					if (err) console.error(err);
					if (data) {
						const critStruct = cfToJs(data);
						critStruct.criteria_REPORT_ID_eq = [this.reportID];
						getReportPersonnel(jsToCf(critStruct), (err, data) => {
							if (err) console.error(err);
							if (data) {
								this.collaborators = data;
							}
						});
					}
				});
			};

			const fetchContacts = () => {
				console.log('fetching contacts');
				getCriteriaStructure('GC3_SUB_REPORT_CONTACT', (err, data) => {
					if (err) console.error(err);
					if (data) {
						const critStruct = cfToJs(data);
						critStruct.criteria_SUB_REPORT_ID_eq = this.allSubReportIDs;
						getSubReportContact(jsToCf(critStruct), (err, data) => {
							if (err) console.error(err);
							if (data) {
								const ownerContactsMap = this.ownerContacts.map(c => c.TYPE_ID);
								data.forEach((record) => {
									if (record.SUB_REPORT_ID === this.ownerSubReport.ID) {
										const index = ownerContactsMap.indexOf(record.TYPE_ID);
										if (index !== -1) {
											this.ownerContacts[index].QUANTITY = record.QUANTITY;
										}
									} else {
										this.collaboratorRecords.contacts.push(record);
									}
								});
							}
						});
					}
				});
			};

			const fetchContactTypes = () => {
				getContactTypes((err, data) => {
					if (err) console.error(err);
					if (data) this.contactTypes = data;
				});
			};

			const fetchOutcomes = () => {
				console.log('fetching outcomes');
				getCriteriaStructure('GC3_SUB_REPORT_PURPOSE_ACHIEVEMENTS', (err, data) => {
					if (err) console.error(err);
					if (data) {
						const critStruct = cfToJs(data);
						critStruct.criteria_SUB_REPORT_ID_eq = this.allSubReportIDs;
						getSubReportPurposeAchievements(jsToCf(critStruct), (err, data) => {
							if (err) console.error(err);
							if (data) {
								data.forEach((record) => {
									if (record.SUB_REPORT_ID === this.ownerSubReport.ID) {
										this.ownerOutcomes = [record];
									} else {
										this.collaboratorRecords.outcomes.push(record);
									}
								});
							}
						});
					}
				});
			};

			const fetchPersonnel = () => {
				getPersonnel((err, data) => {
					if (err) console.error(err);
					if (data) {
						this.personnel = data;
					}
				});
			};

			const fetchPlannedPrograms = () => {
				if (!this.criteriaStructureTemplates.plannedProgram) {
					getCriteriaStructure('FPW_PLANNED_PROGRAM', (err, data) => {
						if (err) console.error(err);
						if (data) {
							let critStruct = cfToJs(data);
							critStruct.criteria_USER_ID_eq.push(activeUserID);
							getPlannedPrograms(jsToCf(critStruct), (err, data) => {
								if (err) console.error(err);
								if (data) {
									this.ownerState.plannedPrograms = data;
								}
							});
						}
					});
				} else {
					let critStruct = Object.assign({}, this.criteriaStructureTemplates.plannedProgram);
					critStruct.criteria_USER_ID_eq.push(activeUserID);
					getPlannedPrograms(jsToCf(critStruct), (err, data) => {
						if (err) console.error(err);
						if (data) this.ownerState.plannedPrograms = data;
					});
				}
			};

			const fetchRoles = () => {
				console.log('fetching roles');
				getCriteriaStructure('GC3_ASSOCIATION_SUB_REPORT_ROLE', (err, data) => {
					if (err) console.error(err);
					if (data) {
						const critStruct = cfToJs(data);
						critStruct.criteria_SUB_REPORT_ID_eq = this.allSubReportIDs;
						getAssociationSubReportRole(jsToCf(critStruct), (err, data) => {
							if (err) console.error(err);
							if (data) {
								data.forEach((record) => {
									if (record.SUB_REPORT_ID === this.ownerSubReport.ID) {
										delete record.SUB_REPORT_ROLE_LABEL;
										this.ownerRoles.push(record);
									} else {
										this.collaboratorRecords.roles.push(record);
									}
								});
							}
						});
					}
				});
			};

			const fetchRoleTypes = () => {
				getAssociationReportTypeRole((err, data) => {
					if (err) console.error(err);
					if (data) {
						this.ownerState.unfilteredRoleTypes = data;
					}
				});
			};

			const fetchStatePlannedPrograms = () => {
				getStatePlannedPrograms((err, data) => {
					if (err) console.error(err);
					if (data) this.statePlannedPrograms = data;
				});
			};

			const fetchSubReports = (callback) => {
				console.log('fetching subreports');
				const critStruct = Object.assign({}, this.criteriaStructureTemplates.subReport);
				critStruct.criteria_REPORT_ID_eq = [this.reportID || url.getParam('duplicateID')];
				getSubReport(jsToCf(critStruct), (err, data) => {
					if (err) console.error(err);
					if (data) {
						data.forEach((record) => {
							const subReport = {};
							[
								'ID',
								'USER_ID',
								'ACTUAL_SUBMITTER_ID',
								'REPORT_ID',
								'PLANNED_PROGRAM_ID',
								'STATE_PLANNED_PROGRAM_ID',
								'IS_HIGHLIGHTED',
								'DATE_CREATED',
								'DATE_LAST_UPDATED'
							].forEach((key) => {
								if (record[key]) subReport[key] = record[key];
							});
							if (subReport.USER_ID === this.ownerID) {
								this.ownerState.issueType = subReport.PLANNED_PROGRAM_ID ? 'local' : 'state';
								this.ownerSubReport = subReport;
							} else {
								this.collaboratorRecords.subReports.push(subReport);
							}
						});
						callback();
					}
				});
			};

			const fetchSubReportCriteriaStructure = (callback) => {
				console.log('fetching subreport crit struct');
				getCriteriaStructure('GC3_SUB_REPORT', (err, data) => {
					if (err) console.error(err);
					if (data) {
						this.criteriaStructureTemplates.subReport = data;
					}
					callback();
				});
			};

			const fetchExistingData = () => {
				fetchCollaborators();
				fetchSubReportCriteriaStructure(() => {
					fetchSubReports(() => {
						fetchContacts();
						fetchOutcomes();
						fetchCollaboratorPlannedPrograms();
						fetchRoles();
					});
				});
			};

			if (this.editMode === 'owner') {
				fetchCriteriaStructures();
				fetchPlannedPrograms();
				fetchStatePlannedPrograms();
				fetchPersonnel();
				fetchRoleTypes();
				fetchContactTypes();
				this.populateOwnerContactsRecords();
				this.populateOwnerOutcomeRecord();
			}
			if (this.reportID !== null || typeof url.getParam('duplicateID') === 'string') fetchExistingData();
		},
		watch: {
			reportContacts () {
				this.populateOwnerContactsRecords();
			}
		}
	};
</script>

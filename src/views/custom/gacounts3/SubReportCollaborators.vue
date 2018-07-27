<template lang="html">
	<div v-if="personnel.length > 0">
		<div>
			<h3>
				Report Owner - {{ getPersonnelNameFromID(activeUserID) }}
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
						<select v-if="ownerState.statePlannedPrograms.length > 0" v-model="ownerSubReport.STATE_PLANNED_PROGRAM_ID">
							<option v-for="program in ownerState.statePlannedPrograms" :value="program.ID">
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
			</div>
			<div v-else>

			</div>
		</div>
		<div>
			<h3>
				Collaborators
			</h3>
			<div v-for="collaborator in collaborators">

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
	import {
		getAssociationReportTypeContactType,
		getAssociationReportTypeRole,
		getContactTypes,
		getCriteriaStructure,
		getPersonnel,
		getPlannedPrograms,
		getStatePlannedPrograms
	} from '@/modules/caesdb';
	import {
		cfToJs,
		filter,
		jsToCf
	} from '@/modules/criteriaUtils';

	export default {
		name: 'SubReportCollaborators',
		components: { FuzzySelect },
		computed: {
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
			ownerOutcomes: {
				get () {
					return this.$store.state.subschemas.subReport.supplementalData.records;
				},
				set (val) {
					this.$store.state.subschemas.subReport.supplementalData.records = val;
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
					statePlannedPrograms: [],
					unfilteredRoleTypes: []
				},
				personnel: []
			};

			return data;
		},
		methods: {
			addCollaborator () {
				this.collaborators.push(Object.assign({}, this.newCollaborator));
				this.newCollaborator = {};
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

			const fetchContactTypes = () => {
				getContactTypes((err, data) => {
					if (err) console.error(err);
					if (data) this.contactTypes = data;
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
					if (data) this.ownerState.statePlannedPrograms = data;
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
			}
		},
		watch: {
			reportContacts () {
				this.populateOwnerContactsRecords();
			}
		}
	};
</script>

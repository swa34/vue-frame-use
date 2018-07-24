<template lang="html">
	<div>
		<!-- Planned Program -->
		<label>
			<h3>
				Type of Issue
			</h3>
			<select v-model="issueType">
				<option value="local">
					Local
				</option>
				<option value="state">
					State
				</option>
			</select>
		</label>
		<label v-if="issueType === 'local'">
			<h3>
				Local Issue
			</h3>
			<select v-if="plannedPrograms.length > 0" v-model="record.PLANNED_PROGRAM_ID">
				<option v-for="program in plannedPrograms" :value="program.ID">
					{{ program.NAME }}
				</option>
			</select>
			<p v-else>
				<em>
					There are no local issues associated with your account.
				</em>
			</p>
		</label>
		<label v-else-if="issueType === 'state'">
			<h3>
				State Issue
			</h3>
			<select v-model="record.STATE_PLANNED_PROGRAM_ID">
				<option v-for="program in statePlannedPrograms" :value="program.ID">
					{{ program.NAME }}
				</option>
			</select>
		</label>
		<!-- Roles -->
		<h3>
			Roles
		</h3>
		<ul v-if="reportType !== -1" class="checkbox">
			<li v-for="role in roleTypes">
				<label>
					<input type="checkbox" :value="generateRoleRecord(role)" v-model="roles" />
					<span>
						{{ role.SUB_REPORT_ROLE_LABEL }}
					</span>
				</label>
			</li>
		</ul>
		<!-- Contacts  -->
		<table v-if="contacts.length > 0">
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
				<tr v-for="contact in contacts">
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
						{{ totalContacts }}
					</td>
				</tr>
			</tfoot>
		</table>
		<!-- Supplemental Data -->
		<SupplementalData
			:forSubReport="true"
		/>
	</div>
</template>

<script>
	/* global activeUserID */
	import SupplementalData from '@/views/custom/gacounts3/SupplementalData';
	import {
		getAssociationReportTypeContactType,
		getAssociationReportTypeRole,
		getAssociationSubReportField,
		getAssociationSubReportRole,
		getContactTypes,
		getCriteriaStructure,
		getPlannedPrograms,
		getStatePlannedPrograms,
		getSubReport,
		getSubReportContact
	} from '@/modules/caesdb';
	import {
		cfToJs,
		filter,
		jsToCf
	} from '@/modules/criteriaUtils';

	export default {
		name: 'SubReportForReport',
		components: {
			SupplementalData
		},
		computed: {
			contacts: {
				get () {
					return this.$store.state.subschemas.subReport.contacts.records;
				},
				set (val) {
					this.$store.state.subschemas.subReport.contacts.records = val;
				}
			},
			criteriaStructures () {
				const critStructs = {
					associationReportTypeContactType: Object.assign({}, this.criteriaStructureTemplates.associationReportTypeContactType),
					associationReportTypeRole: Object.assign({}, this.criteriaStructureTemplates.associationReportTypeRole)
				};
				const reportTypes = this.$store.state.reportType.records.map(r => r.TYPE_ID);
				critStructs.associationReportTypeContactType.criteria_REPORT_TYPE_ID_eq = reportTypes;
				critStructs.associationReportTypeRole.criteria_TYPE_ID_eq = reportTypes;
				return critStructs;
			},
			neededReportValues () {
				return {
					report: {
						USER_ID: this.$store.state.report.OWNER_ID,
						ACTUAL_SUBMITTER_ID: this.$store.state.report.ACTUAL_SUBMITTER_ID,
						REPORT_ID: this.$store.state.report.ID
					},
					contacts: this.$store.state.contacts.records
				};
			},
			record: {
				get () {
					return this.$store.state.subschemas.subReport.subReport;
				},
				set (val) {
					this.$store.state.subschemas.subReport.subReport = val;
				}
			},
			reportId () {
				return this.$store.state.report.ID;
			},
			reportType () {
				const reportTypeRecords = this.$store.state.reportType.records;
				return reportTypeRecords.length > 0 ? reportTypeRecords[0].TYPE_ID : -1;
			},
			roles: {
				get () {
					return this.$store.state.subschemas.subReport.roles.records;
				},
				set (val) {
					this.$store.state.subschemas.subReport.roles.records = val;
				}
			},
			roleTypes () {
				return filter(this.unfilteredRoleTypes, this.criteriaStructures.associationReportTypeRole);
			},
			supplementalData: {
				get () {
					return this.$store.state.subschemas.subReport.supplementalData.records;
				},
				set (val) {
					this.$store.state.subschemas.subReport.supplementalData.records = val;
				}
			},
			totalContacts () {
				let sum = 0;
				this.contacts.forEach((contact) => {
					sum += Number(contact.QUANTITY);
				});
				return sum;
			}
		},
		data () {
			return {
				contactTypes: [],
				criteriaStructureTemplates: {
					associationReportTypeContactType: {},
					associationReportTypeRole: {},
					subReport: {}
				},
				issueType: 'local',
				plannedPrograms: [],
				statePlannedPrograms: [],
				unfilteredRoleTypes: []
			};
		},
		methods: {
			getContactLabelFromID (id) {
				const index = this.contactTypes.map(t => t.ID).indexOf(id);
				if (index === -1) return '';
				return this.contactTypes[index].LABEL;
			},
			generateRoleRecord (role) {
				return {
					SUB_REPORT_ID: this.record.ID,
					ROLE_ID: role.ROLE_ID
				};
			},
			populateContactsRecords () {
				if (this.neededReportValues.contacts.length > 0) {
					const contacts = [];
					this.neededReportValues.contacts.forEach((record) => {
						let newRecord = Object.assign({}, record);
						newRecord.QUANTITY = null;
						contacts.push(newRecord);
					});
					this.contacts = contacts;
				} else if (this.contacts.length < 1) {
					getAssociationReportTypeContactType((err, data) => {
						if (err) console.error(err);
						if (data) {
							data.forEach((record) => {
								if (record.REPORT_TYPE_ID === this.reportType) {
									this.contacts.push({
										REPORT_ID: this.reportId,
										TYPE_ID: record.CONTACT_TYPE_ID,
										QUANTITY: null
									});
								}
							});
						}
					});
				}
			},
			importReportData () {
				this.record = Object.assign(this.record, this.neededReportValues.report);
			}
		},
		mounted () {
			this.importReportData();
			this.populateContactsRecords();
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
			getContactTypes((err, data) => {
				if (err) console.error(err);
				if (data) {
					this.contactTypes = data;
				}
			});
			getAssociationReportTypeRole((err, data) => {
				if (err) console.error(err);
				if (data) {
					this.unfilteredRoleTypes = data;
				}
			});
			getCriteriaStructure('FPW_PLANNED_PROGRAM', (err, data) => {
				if (err) console.error(err);
				if (data) {
					let critStruct = cfToJs(data);
					critStruct.criteria_USER_ID_eq.push(activeUserID);
					getPlannedPrograms(jsToCf(critStruct), (err, data) => {
						if (err) console.error(err);
						if (data) {
							this.plannedPrograms = data;
						}
					});
				}
			});
			getStatePlannedPrograms((err, data) => {
				if (err) console.error(err);
				if (data) {
					this.statePlannedPrograms = data;
				}
			});

			const fetchExistingData = () => {
				const fetchSubReportCriteriaStructure = (callback) => {
					console.log('fetching subreport crit struct');
					getCriteriaStructure('GC3_SUB_REPORT', (err, data) => {
						if (err) console.error(err);
						if (data) {
							this.criteriaStructureTemplates.subReport = data;
							callback();
						}
					});
				};
				const fetchSubReport = (callback) => {
					console.log('fetching sub report');
					const critStruct = Object.assign({}, this.criteriaStructureTemplates.subReport);
					critStruct.criteria_REPORT_ID_eq = this.reportId;
					critStruct.criteria_USER_ID_eq = activeUserID;
					getSubReport(jsToCf(critStruct), (err, data) => {
						if (err) console.error(err);
						if (data) {
							const existingSubReport = data[0];
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
								if (existingSubReport[key]) this.record[key] = existingSubReport[key];
								if (existingSubReport.PLANNED_PROGRAM_ID) {
									this.issueType = 'local';
								} else if (existingSubReport.STATE_PLANNED_PROGRAM_ID) {
									this.issueType = 'state';
								}
							});
							callback();
						}
					});
				};

				const fetchRoles = () => {
					console.log('fetch subreport roles');
					getCriteriaStructure('GC3_ASSOCIATION_SUB_REPORT_ROLE', (err, data) => {
						if (err) console.error(err);
						if (data) {
							const critStruct = cfToJs(data);
							critStruct.criteria_SUB_REPORT_ID_eq = this.record.ID || -1;
							getAssociationSubReportRole(jsToCf(critStruct), (err, data) => {
								if (err) console.error(err);
								if (data) {
									data.forEach((record) => {
										delete record.SUB_REPORT_ROLE_LABEL;
									});
									this.roles = data;
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
							critStruct.criteria_SUB_REPORT_ID_eq = this.record.ID || -1;
							getSubReportContact(jsToCf(critStruct), (err, data) => {
								if (err) console.error(err);
								if (data) {
									const contactsMap = this.contacts.map(c => c.TYPE_ID);
									data.forEach((record) => {
										const index = contactsMap.indexOf(record.TYPE_ID);
										if (index !== -1) this.contacts[index].QUANTITY = record.QUANTITY;
									});
								}
							});
						}
					});
				};

				const fetchSupplementalData = () => {
					console.log('fetching supplemental data');
					getCriteriaStructure('GC3_ASSOCIATION_SUB_REPORT_FIELD', (err, data) => {
						if (err) console.error(err);
						if (data) {
							const critStruct = cfToJs(data);
							critStruct.criteria_SUB_REPORT_ID_eq = this.record.ID || -1;
							getAssociationSubReportField(jsToCf(critStruct), (err, data) => {
								if (err) console.error(err);
								if (data) {
									const suppDataMap = this.supplementalData.map(d => d.FIELD_ID);
									data.forEach((record) => {
										const index = suppDataMap.indexOf(record.FIELD_ID);
										if (index !== -1) this.supplementalData[index].FIELD_VALUE = record.FIELD_VALUE;
									});
								}
							});
						}
					});
				};

				fetchSubReportCriteriaStructure(() => {
					fetchSubReport(() => {
						fetchRoles();
						fetchContacts();
						fetchSupplementalData();
					});
				});
			};
			if (this.reportId !== null) fetchExistingData();
		},
		watch: {
			neededReportValues (values) {
				this.importReportData();
				this.populateContactsRecords();
			}
		}
	};
</script>

<style lang="scss" scoped>
	ul {
		list-style-type: none;
		padding: 0;
		column-count: 2;
		column-width: 7.5rem;
		li {
			break-inside: avoid-column;
		}
	}
</style>

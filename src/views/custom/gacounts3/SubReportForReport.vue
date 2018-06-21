<template lang="html">
	<div>
		<h3>
			Sub-Report
		</h3>
		<!-- Planned Program -->
		<label>
			<strong>
				Type of Issue
			</strong>
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
			<strong>
				Local Issue
			</strong>
			<select v-model="record.PLANNED_PROGRAM_ID">
				<option v-for="program in plannedPrograms" :value="program.ID">
					{{ program.NAME }}
				</option>
			</select>
		</label>
		<label v-else-if="issueType === 'state'">
			<strong>
				State Issue
			</strong>
			<select v-model="record.STATE_PLANNED_PROGRAM_ID">
				<option v-for="program in statePlannedPrograms" :value="program.ID">
					{{ program.NAME }}
				</option>
			</select>
		</label>
		<!-- Roles -->
		<h4>
			Roles
		</h4>
		<ul v-if="reportType !== -1">
			<li v-for="role in roleTypes">
				<label>
					<input type="checkbox" :value="generateRoleRecord(role)" v-model="roles" />
					<span>
						{{ role.SUB_REPORT_ROLE_LABEL }}
					</span>
				</label>
			</li>
		</ul>
		<hr />
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
		<hr />
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
		getAssociationReportTypeRole,
		getCriteriaStructure,
		getPlannedPrograms,
		getStatePlannedPrograms
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
			contactTypes () {
				const contactAssociationIndex = this.$store.state.schema.associations.map(a => a.title).indexOf('Contacts');
				const contactTypesIndex = this.$store.state.schema.associations[contactAssociationIndex].schema.columns.map(c => c.columnName).indexOf('TYPE_ID');
				return this.$store.state.schema.associations[contactAssociationIndex].schema.columns[contactTypesIndex].constraint.values;
			},
			criteriaStructure () {
				const critStruct = Object.assign({}, this.criteriaStructureTemplate);
				critStruct.criteria_TYPE_ID_eq = this.$store.state.reportType.records.map(r => r.TYPE_ID);
				return critStruct;
			},
			neededReportValues () {
				return {
					report: {
						USER_ID: this.$store.state.report.OWNER_ID,
						ACTUAL_SUBMITTER_ID: this.$store.state.report.ACTUAL_SUBMITTER_ID,
						REPORT_ID: this.$store.state.report.ID,
						STATE_PLANNED_PROGRAM_ID: this.$store.state.report.STATE_PLANNED_PROGRAM_ID,
						PLANNED_PROGRAM_ID: this.$store.state.report.PLANNED_PROGRAM_ID
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
				return filter(this.unfilteredRoleTypes, this.criteriaStructure);
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
				criteriaStructureTemplate: {},
				issueType: 'local',
				plannedPrograms: [],
				statePlannedPrograms: [],
				unfilteredRoleTypes: []
			};
		},
		methods: {
			getContactLabelFromID (id) {
				let label = '';
				this.contactTypes.forEach((type) => {
					if (type.key === id) label = type.label;
				});
				return label;
			},
			generateRoleRecord (role) {
				return {
					SUB_REPORT_ID: null,
					ROLE_ID: role.ROLE_ID
				};
			}
		},
		mounted () {
			getCriteriaStructure('GC3_ASSOCIATION_REPORT_TYPE_ROLE', (err, data) => {
				if (err) console.error(err);
				if (data) {
					this.criteriaStructureTemplate = cfToJs(data);
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
		},
		watch: {
			neededReportValues (values) {
				this.record = Object.assign(this.record, values.report);
				let contacts = [];
				values.contacts.forEach((record) => {
					let newRecord = Object.assign({}, record);
					newRecord.QUANTITY = null;
					contacts.push(newRecord);
				});
				this.contacts = contacts;
			}
		}
	};
</script>

<style lang="scss" scoped>
	ul {
		list-style-type: none;
		padding: 0;
		column-count: 5;
		column-width: 7.5rem;
		li {
			break-inside: avoid-column;
		}
	}
</style>

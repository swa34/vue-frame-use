<template lang="html">
	<div>
		<h3>
			Sub-Report
		</h3>
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
						<input type="number" v-model.number="contact.QUANTITY" />
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
		<SupplementalData
			:forSubReport="true"
		/>
	</div>
</template>

<script>
	// import { mapState } from 'vuex';
	import SupplementalData from '@/views/custom/gacounts3/SupplementalData';

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
			roles: {
				get () {
					return this.$store.state.subschemas.subReport.roles.records;
				},
				set (val) {
					this.$store.state.subschemas.subReport.roles.records = val;
				}
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
		methods: {
			getContactLabelFromID (id) {
				let label = '';
				this.contactTypes.forEach((type) => {
					if (type.key === id) label = type.label;
				});
				return label;
			}
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

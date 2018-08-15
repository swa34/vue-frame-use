<template lang="html">
	<div class="container">
		<!-- State Issue -->
		<div class="row" v-if="data.subReport.statePlannedProgram">
			<strong>
				State Issue:
			</strong>
			<span>
				{{ data.subReport.statePlannedProgram.NAME }}
			</span>
		</div>
		<!-- Local Issue -->
		<div class="row" v-if="data.subReport.plannedProgram">
			<strong>
				Local Issue:
			</strong>
			<span>
				{{ data.subReport.plannedProgram.NAME }}
			</span>
		</div>
		<!-- Roles -->
		<div class="row">
			<div v-if="data.roles.length > 0">
				<strong>
					Role(s):
				</strong>
				<span v-for="(role, index) in data.roles">
					{{ role.SUB_REPORT_ROLE_LABEL ? role.SUB_REPORT_ROLE_LABEL : getRoleLabelFromTypeID(role.ROLE_ID) }}{{ index !== data.roles.length - 1 ? ',' : '' }}
				</span>
			</div>
			<div v-else>
				<strong>
					Role(s):
				</strong>
				<em>
					(None)
				</em>
			</div>
		</div>
		<!-- Outcomes, Impacts, and Achievements -->
		<div class="row">
			<div v-if="data.outcomes.length > 0">
				<strong>
					Outcome, Impact, &amp; Achievements:
				</strong>
				<span v-for="outcome in data.outcomes">
					{{ outcome.MEMO }}
				</span>
			</div>
			<div v-else>
				<strong>
					Outcome, Impact, &amp; Achievements:
				</strong>
				<em>
					(None)
				</em>
			</div>
		</div>
		<!-- Contacts -->
		<div class="row" v-if="data.contacts.length > 0">
			<h4>
				Contacts
			</h4>
			<table>
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
					<tr v-for="contact in data.contacts">
						<td>
							{{ contact.CONTACT_TYPE_LABEL }}
						</td>
						<td>
							{{ contact.QUANTITY }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- Supplemental Data -->
		<div class="row" v-if="data.supplementalData.length > 0">
			<h4>
				Supplemental Data
			</h4>
			<table>
				<thead>
					<tr>
						<th>
							Field
						</th>
						<th>
							Value
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="record in data.supplementalData">
						<td>
							{{ record.REPORT_FIELD_LABEL }}
						</td>
						<td>
							{{ fieldTypesWithLabels.indexOf(record.FIELD_TYPE_LABEL) !== -1 ? record.FIELD_OPTION_LABEL : record.FIELD_VALUE }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
	// import {
	// 	cfToJs,
	// 	jsToCf
	// } from '@/modules/criteriaUtils';
	// import {
	// 	getCriteriaStructure,
	// 	getPlannedPrograms
	// } from '@/modules/caesdb';

	export default {
		name: 'SubReportPlainText',
		props: {
			data: {
				type: Object,
				required: true
			},
			roleTypes: {
				type: Array
			}
		},
		data () {
			return {
				fieldTypesWithLabels: [
					'String Data',
					'Option Data'
				]
			};
		},
		methods: {
			getRoleLabelFromTypeID (id) {
				const index = this.roleTypes.map(t => t.ROLE_ID).indexOf(id);
				if (index === -1) return '';
				return this.roleTypes[index].SUB_REPORT_ROLE_LABEL;
			}
		},
		mounted () {
			// const fetchPlannedProgram = () => {
			// 	getCriteriaStructure('FPW_PLANNED_PROGRAM', (err, data) => {
			// 		if (err) console.error(err);
			// 		if (data) {
			// 			let critStruct = cfToJs(data);
			// 			critStruct.criteria_ID_eq = [this.data.subReport.PLANNED_PROGRAM_ID];
			// 			getPlannedPrograms(jsToCf(critStruct), (err, data) => {
			// 				if (err) console.error(err);
			// 				if (data) {
			// 					this.plannedProgram = data[0];
			// 				}
			// 			});
			// 		}
			// 	});
			// };
			//
			// if (this.data.subReport) fetchPlannedProgram();
		}
	};
</script>

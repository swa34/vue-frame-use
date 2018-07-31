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
			<strong>
				Role(s):
			</strong>
			<ul v-if="data.roles.length > 0">
				<li v-for="role in data.roles">
					{{ role.SUB_REPORT_ROLE_LABEL }}
				</li>
			</ul>
			<p v-else>
				<em>
					(None)
				</em>
			</p>
		</div>
		<!-- Outcomes, Impacts, and Achievements -->
		<div class="row">
			<strong>
				Outcome, Impact, &amp; Achievements:
			</strong>
			<div v-if="data.outcomes.length > 0">
				<p v-for="outcome in data.outcomes">
					{{ outcome.MEMO }}
				</p>
			</div>
			<p v-else>
				<em>
					(None)
				</em>
			</p>
		</div>
		<!-- Contacts -->
		<div class="row" v-if="data.contacts.length > 0">
			<table>
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
			<table>
				<caption>
					Supplemental Data
				</caption>
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
							{{ record.FIELD_OPTION_LABEL || record.FIELD_VALUE }}
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
			}
		},
		data () {
			return {
				plannedProgram: {}
			};
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

<style lang="scss" scoped>

</style>

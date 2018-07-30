<template lang="html">
	<div class="container">
		<div class="row" v-if="data.subReport.statePlannedProgram">
			<strong>
				State Issue:
			</strong>
			<span>
				{{ data.subReport.statePlannedProgram.NAME }}
			</span>
		</div>
		<div class="row" v-if="data.subReport.plannedProgram">
			<strong>
				Local Issue:
			</strong>
			<span>
				{{ data.subReport.plannedProgram.NAME }}
			</span>
		</div>
		<div class="row">
			<strong>
				Role(s):
			</strong>
			<ul>
				<li v-for="role in data.roles">
					{{ role.SUB_REPORT_ROLE_LABEL }}
				</li>
			</ul>
		</div>
		<div class="row">
			<strong>
				Outcome, Impact, &amp; Achievements:
			</strong>
			<p v-for="outcome in data.outcomes">
				{{ outcome.MEMO }}
			</p>
		</div>
	</div>
</template>

<script>
	import {
		cfToJs,
		jsToCf
	} from '@/modules/criteriaUtils';
	import {
		getCriteriaStructure,
		getPlannedPrograms
	} from '@/modules/caesdb';

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
			const fetchPlannedProgram = () => {
				getCriteriaStructure('FPW_PLANNED_PROGRAM', (err, data) => {
					if (err) console.error(err);
					if (data) {
						let critStruct = cfToJs(data);
						critStruct.criteria_ID_eq = [this.data.subReport.PLANNED_PROGRAM_ID];
						getPlannedPrograms(jsToCf(critStruct), (err, data) => {
							if (err) console.error(err);
							if (data) {
								this.plannedProgram = data[0];
							}
						});
					}
				});
			};

			if (this.data.subReport) fetchPlannedProgram();
		}
	};
</script>

<style lang="scss" scoped>

</style>

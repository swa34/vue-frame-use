<template lang="html">
	<div>
		<h3>
			Sub-Report
		</h3>
	</div>
</template>

<script>
	// import { mapState } from 'vuex';
	export default {
		name: 'SubReportForReport',
		computed: {
			neededReportValues () {
				return {
					USER_ID: this.$store.state.report.OWNER_ID,
					ACTUAL_SUBMITTER_ID: this.$store.state.report.ACTUAL_SUBMITTER_ID,
					REPORT_ID: this.$store.state.report.ID,
					STATE_PLANNED_PROGRAM_ID: this.$store.state.report.STATE_PLANNED_PROGRAM_ID,
					PLANNED_PROGRAM_ID: this.$store.state.report.PLANNED_PROGRAM_ID
				};
			},
			record: {
				get () {
					return this.$store.state.subschemas.subReport.subReport;
				},
				set (val) {
					this.$store.state.subschemas.subReport.subReport = val;
				}
			}
		},
		watch: {
			neededReportValues (values) {
				this.record = Object.assign(this.record, values);
			}
		}
	};
</script>

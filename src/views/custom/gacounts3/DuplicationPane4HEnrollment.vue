<template lang="html">
	<div>
		<h3>4H Enrollment Activities</h3>
		<p>
			The report you are duplicating is associated with the following 4H
			Enrollment Activities.  If you would like to carry those associations over
			to this new report, simply check "Demographic Information" to the left.
		</p>
		<p>
			Should you wish to select different 4H Enrollment Activities, simply do not
			select "Demographic Information" and then use the green 4H Import button as
			you normally would when entering a new report.
		</p>
		<p>
			<strong>Activities</strong>
			<ul :class="listClasses">
				<li v-for="activity in enrollmentActivities" :key="activity.ACTIVITY_ID">
					{{ activity.ACTIVITY_NAME }}
				</li>
			</ul>
		</p>
	</div>
</template>

<script>
	import { getAssociationReport4HEnrollmentActivity } from '~/modules/caesdb/gacounts3';
	import {
		getCriteriaStructure,
		logError
	} from '~/modules/caesdb';

	export default {
		name: 'DuplicationPanel4HEnrollment',
		props: {
			demographicsSelectedForImport: {
				type: Boolean
			}
		},
		data () {
			const url = new URL(window.location.href);
			const duplicateId = Number(url.searchParams.get('duplicateID'));

			return {
				enrollmentActivities: [],
				duplicateId
			};
		},
		computed: {
			listClasses () {
				const classes = ['activity-list'];
				if (!this.demographicsSelectedForImport) classes.push('disabled-text');

				return classes.join(' ');
			}
		},
		watch: {
			demographicsSelectedForImport (val) {
				if (val === true) this.$store.state['4HEnrollmentActivities'].records = [...this.enrollmentActivities];
				else this.$store.state['4HEnrollmentActivities'].records = [];
			}
		},
		mounted () {
			getCriteriaStructure('GACOUNTS3', 'GC3_ASSOCIATION_REPORT_4H_ENROLLMENT_ACTIVITY', (err, data) => {
				if (err) logError(new Error('Could not fetch criteria structure'));
				if (!data) return;

				const critStruct = { ...data };
				critStruct.criteria_REPORT_ID_eq.push(this.duplicateId);
				getAssociationReport4HEnrollmentActivity(critStruct, (subErr, subData) => {
					if (subErr) logError(new Error('Could not fetch enrollment activity associations'));
					if (!subData) return;

					subData
						// eslint-disable-next-line no-unused-vars
						.map(({ REPORT_ID, DATE_CREATED, ...association }) => association)
						.forEach(association => this.enrollmentActivities.push(association));
				});
			});
		}
	};
</script>

<style lang="scss" scoped>
	ul {
		&.activity-list { padding: 0 1rem; }

		&.disabled-text {
			color: #aaa;
			text-decoration: line-through;
			font-style: italic;
		}
	}
</style>

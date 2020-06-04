<template lang="html">
	<div>
		<div v-if="hasEnrollmentActivities" class="pane-wrapper">
			<h3>Want to duplicate 4-H Enrollment data?</h3>
			<p>
				You are duplicating a report that imported data from the following 4-H
				Enrollment activities:
			</p>
			<p>
				<strong>Activities</strong>
				<ul class="activity-list">
					<li v-for="activity in enrollmentActivities" :key="activity.ACTIVITY_ID">
						{{ activity.ACTIVITY_NAME }}
					</li>
				</ul>
			</p>
			<p>
				If you select the "Demographic Information" to the left, numbers from
				these activities will be imported for your new report.
			</p>
			<p class="four-h-logo-wrapper">
				<img src="/global/images/4h-logo-green.svg" alt="4-H Logo" />
			</p>
		</div>
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
			hasEnrollmentActivities () { return this.enrollmentActivities.length > 0; }
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
	div.pane-wrapper {
		margin: 0 2rem;
	}

	ul {
		&.activity-list { padding: 0 1rem; }

		&.disabled-text {
			color: #aaa;
			text-decoration: line-through;
			font-style: italic;
		}
	}

	p.four-h-logo-wrapper {
		text-align: center;

		img { width: 10rem; }
	}
</style>

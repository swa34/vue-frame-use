<template lang="html">
	<div class="two-column">
		<DataRadio
			:title="area.data.title"
			:schema="area.data.schema"
			:associated-column="area.data.associatedColumn"
			:identifier="generateIdentifier(area.data)"
			:filter="area.data.filter"
			:description="area.data.description"
			:affects="area.data.affects"
			:help-message-name="area.data.helpMessageName"
			:mode="mode"
		/>
		<div v-if="selectedReportType" class="details">
			<h4>{{ selectedReportType.LABEL }}</h4>
			<p>
				Informal educational programming.  This may include field days, tours,
				and contests.  The list is almost endless... these are activities that
				you helped to coordinate but may not have had a formal presentation.  If
				you had a presentation you will want to record it in another appropriate
				report type but take credit for the overall event here.
			</p>
			<p>
				<strong>Examples:</strong>
				<span>
					Career Days, Judging Events, Chamber of Commerce Luncheons, County
					Fairs, Field Days, Pizza Farm, Awards programs, etc.
				</span>
			</p>
			<p>
				<strong>Where on the FAR:</strong>
				<span>
					Other Contributions in Extension or Outreach (Educational Events)
				</span>
			</p>
		</div>
	</div>
</template>

<script>
	/* global caesCache */
	import { DataRadio } from '~/views/data';
	import { getSortedSchema } from '~/modules/schemaTools';
	import reportSchema from '~/schemas/gacounts3/report';
	import { singleItem } from '@gabegabegabe/utils/dist/array/reducers';

	export default {
		name: 'ReportType',
		components: { DataRadio },
		data () {
			const area = getSortedSchema(reportSchema)
				.sections
				.filter(({ title }) => title === 'Main Report Information')
				.reduce(singleItem)
				.areas
				.filter(({ data: { title } }) => title === 'Report Type')
				.reduce(singleItem);

			const mode = 'edit';

			return { area, mode };
		},
		computed: {
			selectedReportType () {
				if (this.$store.state.reportType.records.length < 1) return null;

				const { TYPE_ID } = this.$store.state.reportType.records.reduce(singleItem);

				return caesCache.data.gc3.reportType
					.filter(({ ID }) => ID === TYPE_ID)
					.reduce(singleItem);
			}
		},
		methods: {
			generateIdentifier (association) {
				return {
					key: association.foreignKey,
					value: null,
					criteriaString: association.criteriaString || `criteria_${association.foreignKey}_eq`,
					duplicate: false
				};
			}
		}
	};
</script>

<style lang="scss" scoped>
	div.two-column {
		display: flex;
		& > div { flex-basis: 33%; }
		div.details { flex-grow: 1; }
	}
</style>

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
			<h4>
				<span class="icon-wrapper">
					<InfoIcon />
				</span>
				<span>
					Report Type: {{ selectedReportType.LABEL }}
				</span>
			</h4>
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
	import { InfoIcon } from 'vue-feather-icons';
	import reportSchema from '~/schemas/gacounts3/report';
	import { singleItem } from '@gabegabegabe/utils/dist/array/reducers';

	export default {
		name: 'ReportType',
		components: { DataRadio, InfoIcon },
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
		align-items: flex-start;
		& > div { flex-basis: 33%; }
		div.details {
			background-color: #87bcde;
			box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
			flex-grow: 1;
			margin-top: 3rem;
			h4 {
				background-color: rgba(0,0,0,.3);
				color: #fff;
				margin-top: 0;
				padding: 1rem;
				span {
					font-size: 1.2rem;
					&.icon-wrapper {
						margin-right: 0.5rem;
						svg { vertical-align: bottom; }
					}
				}
			}
			p {
				&, span, strong { font-size: 1rem; }
				padding: 0 1rem;
			}
		}
	}
</style>

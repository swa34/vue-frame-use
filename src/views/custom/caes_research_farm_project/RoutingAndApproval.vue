<template lang="html">
	<div>
		<div v-for="column in columns" :key="column.columnName">
			<div v-if="columnShouldBeDisplayed(column)">
				<div v-if="typeToShow(column) === 'input'">
					<SmartInput
						v-model="record[column.columnName]"
						:field="column"
						:fetched="record._fetched"
					/>
					<div v-if="column.extra && column.extra.needsApprovalButtons" class="button-container">
						<button type="button" class="approve" @click="approveProject">
							Approve this Project
						</button>
						<button type="button" class="needs-review" @click="submitProjectForReview">
							Project Needs Revision
						</button>
					</div>
				</div>
				<div v-else-if="typeToShow(column) === 'text'">
					<p>
						<h3>
							{{ column.prettyName || getPrettyColumnName(column.columnName) }}
						</h3>
						{{ getDisplayText(column) }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import projectSchema from '@/schemas/caes_research_farm_project/project';
	import SmartInput from '@/views/elements/SmartInput';
	import { getPrettyColumnName } from '@/modules/utilities';

	export default {
		/* global activeUserId */
		name: 'RoutingAndApproval',
		components: { SmartInput },
		props: {
			mode: {
				type: String,
				required: true,
				default: 'view',
				validator (val) {
					return ['edit', 'view'].indexOf(val) !== -1;
				}
			}
		},
		data () {
			return {
				schema: projectSchema
			};
		},
		computed: {
			columns () {
				return this.schema.columns.filter(column => {
					return column.grouping.section === 'Routing and Approval' && !column.automated;
				});
			},
			record: {
				get () { return this.$store.state.project; },
				set (val) { this.$store.state.project = val; }
			}
		},
		methods: {
			getPrettyColumnName,
			approveProject () {
				console.log('approving project');
			},
			columnShouldBeDisplayed (column) {
				if (!column.depends) return true;
				if (Array.isArray(column.depends.column)) {
					return column.depends.test(column.depends.column.map(column => {
						return this.record[column];
					}));
				}
				return column.depends.test(this.$store.state.project[column.depends.column]);
			},
			getDisplayText (column) {
				if (!column.constraint) {
					const value = this.record[column.columnName];
					return value === null || value === '' ? '(None)' : value;
				}
				const constraintValueIndex = column.constraint.values.map(v => v[column.constraint.foreignKey]).indexOf(this.record[column.columnName]);
				if (constraintValueIndex === -1) return '(None)';
				const constraintValue = column.constraint.values[constraintValueIndex];
				return constraintValue[column.constraint.foreignLabel];
			},
			submitProjectForReview () {
				console.log('yo this is whack');
			},
			typeToShow (column) {
				// If it's an ID input, always show the input
				if (column.type === 'int') return this.mode === 'edit' ? 'input' : 'text';
				// Else, if it's a comment section, so we have more work to do
				if (column.type === 'nvarchar') {
					// Grab the index of the project's current status
					const statusIndex = caesCache.data.crfp.status.map(s => s.ID).indexOf(this.record.STATUS_ID);
					// If it's not found, assume it's a new project and so no comment
					// sections should be displayed.
					if (statusIndex === -1) return false;
					// Grab the status from the cache
					const status = caesCache.data.crfp.status[statusIndex];
					// If the current user is the approver and the project is pending
					// their approval, an input should be shown.
					if (activeUserId === this.record[column.extra.personnelColumn] && status.NAME === column.extra.status) return 'input';
					// If the approval date for this comment section is not null, display
					// the comments as plain text.
					if (this.record[column.extra.dateColumn]) return 'text';
				}
				return false;
			}
		}
	};
</script>

<style lang="scss" scoped>
	div.button-container {
		display: flex;
		button {
			margin-right: .5rem;
			&.approve { background-color: #406242; }
			&.needs-review { background-color: #6c3129; }
		}
	}
</style>

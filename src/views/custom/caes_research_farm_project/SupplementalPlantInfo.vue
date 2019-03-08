<template lang="html">
	<section>
		<h3 class="head">
			Plant Science Projects
		</h3>
		<div>
			<h3>
				General Plant Project Info
			</h3>
			<p>
				<label class="checkbox">
					<input v-model="record.IS_SAFE" type="checkbox" />
					<span>
						{{ columns.IS_SAFE.prettyName }}
					</span>
				</label>
			</p>
			<p>
				<label class="checkbox">
					<input v-model="record.MUST_BE_DESTROYED" type="checkbox" />
					<span>
						{{ columns.MUST_BE_DESTROYED.prettyName }}
					</span>
				</label>
			</p>
			<p>
				<label>
					<h4>{{ columns.FIELD_NAME.prettyName }}</h4>
					<input v-model="record.FIELD_NAME" type="text" />
				</label>
			</p>
		</div>
		<div>
			<h3>
				Responsibilities By Task
			</h3>
			<p>
				(Where applicable, please provide detailed instructions for the REC
				staff in the boxes below.  If your experimental protocol will require
				deviation from normal production practices and/or timing, please
				indicate that as well.)
			</p>
			<table>
				<thead>
					<tr>
						<th>Task</th>
						<th>Special Instructions</th>
						<th>Responsible Party</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="columnGroup in tableGroups" :key="columnGroup.name">
						<td>{{ columnGroup.textColumn.prettyName }}</td>
						<td>
							<textarea v-model="record[columnGroup.textColumn.columnName]"></textarea>
						</td>
						<td>
							<select v-model="record[columnGroup.partyColumn.columnName]">
								<option
									v-for="option in responsiblePartyOptions"
									:key="option.ID"
									:value="option.ID"
								>
									{{ option.NAME }}
								</option>
							</select>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>

<script>
	/* global caesCache */
	import supplementalPlantInfoSchema from '@/schemas/caes_research_farm_project/supplemental_plant_info';
	import { getObjectIndexedByKeyFromArray } from '@/modules/utilities';

	export default {
		name: 'SupplementalPlantInfo',
		props: {
			mode: {
				type: String,
				required: true
			}
		},
		data () {
			return {
				columns: getObjectIndexedByKeyFromArray(supplementalPlantInfoSchema.columns, 'columnName'),
				localRecord: supplementalPlantInfoSchema.columns.reduce((out, column) => {
					out[column.columnName] = null;
					return out;
				}, {}),
				responsiblePartyOptions: caesCache.data.crfp.responsibleParty,
				schema: supplementalPlantInfoSchema
			};
		},
		computed: {
			record: {
				get () {
					let records = this.$store.state.supplementalPlantInformation.records;
					if (records.length < 1) return this.localRecord;
					return records[0];
				},
				set (val) {
					let records = this.$store.state.supplementalPlantInformation.records;
					if (records.length < 1) records.push(val);
					records[0] = val;
				}
			},
			tableGroups () {
				return supplementalPlantInfoSchema.columns
					.filter(column => column.tableGroup)
					.reduce((tableGroups, column) => {
						const indexOfGroup = tableGroups.map(g => g.name).indexOf(column.tableGroup.name);
						if (indexOfGroup === -1) {
							const groupObj = { name: column.tableGroup.name };
							groupObj[`${column.tableGroup.class}Column`] = column;
							tableGroups.push(groupObj);
						} else {
							tableGroups[indexOfGroup][`${column.tableGroup.class}Column`] = column;
						}
						return tableGroups;
					}, []);
			}
		},
		mounted () {
			let records = this.$store.state.supplementalPlantInformation.records;
			if (records.length < 1) {
				records.push(this.localRecord);
			} else {
				this.localRecord = records[0];
			}
		}
	};
</script>

<style lang="scss" scoped>
	label.checkbox {
		display: flex;
		input { margin-right: 1rem; }
		span { flex-grow: 1; }
	}
</style>

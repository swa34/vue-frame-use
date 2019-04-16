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
				<div class="radio-container">
					<label class="radio">
						<input v-model="record.IS_SAFE" type="radio" :value="columns['IS_SAFE'].options.true.value" :disabled="mode === 'view'" />
						<span>{{ columns['IS_SAFE'].options.true.label }}</span>
					</label>
					<br />
					<label class="radio">
						<input v-model="record.IS_SAFE" type="radio" :value="columns['IS_SAFE'].options.false.value" :disabled="mode === 'view'" />
						<span>{{ columns['IS_SAFE'].options.false.label }}</span>
					</label>
				</div>
			</p>
			<div v-if="mode === 'edit'">
				<p>
					<label>
						<h4>{{ columns.FIELD_NAME.prettyName }}</h4>
						<input v-model="record.FIELD_NAME" type="text" />
					</label>
				</p>
			</div>
			<div v-else>
				<p>
					<h4>
						{{ columns.FIELD_NAME.prettyName }}
					</h4>
					<span>
						{{ record.FIELD_NAME }}
					</span>
				</p>
			</div>
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
							<textarea v-if="mode === 'edit'" v-model="record[columnGroup.textColumn.columnName]"></textarea>
							<p v-else>
								{{ record[columnGroup.textColumn.columnName] }}
							</p>
						</td>
						<td>
							<select v-if="mode === 'edit'" v-model="record[columnGroup.partyColumn.columnName]">
								<option
									v-for="option in responsiblePartyOptions"
									:key="option.ID"
									:value="option.ID"
								>
									{{ option.NAME }}
								</option>
							</select>
							<span v-else>
								{{ getResponsiblePartyNameFromId(record[columnGroup.partyColumn.columnName]) }}
							</span>
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
	import {
		getCriteriaStructure,
		logError
	} from '@/modules/caesdb';
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
			isNew () { return this.$store.state.project.ID === null; },
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
			if (!this.isNew) this.fetchExistingData();
			// Set default values
			this.schema.columns.forEach(column => {
				if (column.default !== undefined && column.default !== null && this.record[column.columnName] === null) this.record[column.columnName] = column.default;
			});
		},
		methods: {
			fetchExistingData () {
				getCriteriaStructure(this.schema.databaseName, this.schema.tablePrefix, async (err, critStruct) => {
					if (err) {
						logError(err);
					} else {
						critStruct[this.schema.criteria.string] = this.$store.state.project.ID;
						try {
							const result = await this.schema.fetchExisting(critStruct);
							if (result.success) {
								if (result.data.length > 0) {
									const plantInfo = result.data[0];
									for (let key in this.record) {
										if (plantInfo[key]) this.record[key] = plantInfo[key];
									}
								}
							} else {
								logError(result.err);
							}
						} catch (err) {
							logError(err);
						}
					}
				});
			},
			getResponsiblePartyNameFromId (id) {
				if (!id) return null;
				const index = this.responsiblePartyOptions.map(o => o.ID).indexOf(id);
				if (index === -1) return 'Unknown';
				return this.responsiblePartyOptions[index].NAME || 'Unknown';
			}
		}
	};
</script>

<style lang="scss" scoped>
	label.checkbox, label.radio {
		display: flex;
		input { margin-right: 1rem; }
		span { flex-grow: 1; }
	}
	em.required-asterisk { color: #6c3129; }
</style>

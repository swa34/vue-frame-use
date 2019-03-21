<template lang="html">
	<section>
		<h3 class="head">
			Animal Science Projects
		</h3>
		<p>
			NOTE: An Animal Use Protocol (AUP) must be completed for each project
			involving animals, even if no treatments are applied to the animals and no
			data are collected from the animals. This would include, for example,
			studies in which animals are used for grazing forage trials or used to
			create runoff in field studies.
		</p>
		<div>
			<h3>
				General Animal Project Info
			</h3>
			<p>
				<label>
					<h4>AUP Number</h4>
					<input v-model="record.AUP_NUMBER" type="text" required />
				</label>
			</p>
			<p>
				<label>
					<h4>{{ columns.NUMBER.prettyName }}</h4>
					<input v-model="record.NUMBER" type="text" />
				</label>
			</p>
			<p>
				<label>
					<h4>{{ columns.DESCRIPTION.prettyName }}</h4>
					<input v-model="record.DESCRIPTION" type="text" />
				</label>
			</p>
			<p>
				<label>
					<h4>{{ columns.SOURCE.prettyName }}</h4>
					<input v-model="record.SOURCE" type="text" />
				</label>
			</p>
			<p>
				<label>
					<h4>{{ columns.FINAL_DISPOSITION.prettyName }}</h4>
					<input v-model="record.FINAL_DISPOSITION" type="text" />
				</label>
			</p>
		</div>
		<div>
			<h3>
				Animal Feeding Information
			</h3>
			<p>
				<label>
					<h4>{{ columns.FEEDING_REGIME.prettyName }}</h4>
					<textarea v-model="record.FEEDING_REGIME"></textarea>
				</label>
			</p>
			<p>
				<label>
					<h4>{{ columns.TOTAL_FEED_AMOUNT.prettyName }}</h4>
					<input v-model="record.TOTAL_FEED_AMOUNT" type="text" />
				</label>
			</p>
			<p>
				<label>
					<h4>{{ columns.FEED_STORAGE_LOCATION.prettyName }}</h4>
					<input v-model="record.FEED_STORAGE_LOCATION" type="text" />
				</label>
			</p>
			<p>
				<label>
					<h4>{{ columns.SPECIAL_NEEDS.prettyName }}</h4>
					<textarea v-model="record.SPECIAL_NEEDS"></textarea>
				</label>
			</p>
		</div>
		<div>
			<h3>
				Responsibilities By Task
			</h3>
			<p>
				(Where applicable, please provide detailed instructions to the REC staff
				in the boxes below.)
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
						<td>{{ columnGroup.textColumn.prettyName || getPrettyColumnName(columnGroup.textColumn.columnName) }}</td>
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
		<div>
			<h3>Important Dates</h3>
			<table>
				<thead>
					<tr>
						<th
							v-for="column in columnsToBeDisplayed"
							:key="column.columnName"
						>
							{{ column.prettyName || getPrettyColumnName(column.columnName) }}
						</th>
						<th>&nbsp;</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="importantDate in record.importantDates" :key="JSON.stringify(importantDate)">
						<td v-for="column in columnsToBeDisplayed" :key="column.columnName">
							<SmartInput
								v-model="importantDate[column.columnName]"
								:displayLabel="false"
								:field="column"
								:fetched="fetched"
							/>
						</td>
						<td>
							<button class="button" type="button" @click="removeImportantDate(importantDate)">
								Remove
							</button>
						</td>
					</tr>
					<tr>
						<td v-for="column in columnsToBeDisplayed" :key="column.columnName">
							<SmartInput
								v-model="newImportantDate[column.columnName]"
								:displayLabel="false"
								:field="column"
								:fetched="fetched"
							/>
						</td>
						<td>
							<button
								class="button"
								type="button"
								:disabled="!newImportantDateIsValid"
								@click="addNewImportantDate"
							>
								Add
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>

<script>
	/* global caesCache */
	import importantDateSchema from '@/schemas/caes_research_farm_project/important_date';
	import supplementalAnimalInfoSchema from '@/schemas/caes_research_farm_project/supplemental_animal_info';
	import SmartInput from '@/views/elements/SmartInput';

	import {
		getObjectIndexedByKeyFromArray,
		getPrettyColumnName
	} from '@/modules/utilities';

	export default {
		name: 'SupplementalAnimalInfo',
		components: { SmartInput },
		props: {
			mode: {
				type: String,
				required: true
			}
		},
		data () {
			return {
				columns: getObjectIndexedByKeyFromArray(supplementalAnimalInfoSchema.columns, 'columnName'),
				importantDateSchema,
				localRecord: {
					...supplementalAnimalInfoSchema.columns.reduce((out, column) => {
						out[column.columnName] = null;
						return out;
					}, {}),
					importantDates: []
				},
				newImportantDate: importantDateSchema.columns.reduce((output, column) => {
					output[column.columnName] = null;
					return output;
				}, {}),
				responsiblePartyOptions: caesCache.data.crfp.responsibleParty,
				schema: supplementalAnimalInfoSchema
			};
		},
		computed: {
			columnsToBeDisplayed () { return importantDateSchema.columns.filter(c => !c.automated); },
			fetched () { return this.$store.state.supplementalAnimalInformation.fetched; },
			newImportantDateIsValid () {
				return importantDateSchema.columns.reduce((isValid, column) => {
					let val = this.newImportantDate[column.columnName];
					if (!column.automated && column.required && !val) isValid = false;
					return isValid;
				}, true);
			},
			record: {
				get () {
					let records = this.$store.state.supplementalAnimalInformation.records;
					if (records.length < 1) return this.localRecord;
					return records[0];
				},
				set (val) {
					let records = this.$store.state.supplementalAnimalInformation.records;
					if (records.length < 1) records.push(val);
					records[0] = val;
				}
			},
			tableGroups () {
				let tableGroups = [];
				this.schema.columns
					.filter(column => column.tableGroup)
					.forEach(column => {
						let indexOfGroup = tableGroups.map(g => g.name).indexOf(column.tableGroup.name);
						if (indexOfGroup === -1) {
							let groupObj = { name: column.tableGroup.name };
							groupObj[`${column.tableGroup.class}Column`] = column;
							tableGroups.push(groupObj);
						} else {
							tableGroups[indexOfGroup][`${column.tableGroup.class}Column`] = column;
						}
					});
				return tableGroups;
			}
		},
		mounted () {
			let records = this.$store.state.supplementalAnimalInformation.records;
			if (records.length < 1) {
				records.push(this.localRecord);
			} else {
				this.localRecord = records[0];
			}
		},
		methods: {
			addNewImportantDate () {
				this.record.importantDates.push(this.newImportantDate);
				this.newImportantDate = importantDateSchema.columns.reduce((output, column) => {
					output[column.columnName] = null;
					return output;
				}, {});
			},
			getPrettyColumnName,
			removeImportantDate (importantDate) {
				const index = this.record.importantDates.map(d => JSON.stringify(d)).indexOf(JSON.stringify(importantDate));
				this.record.importantDates.splice(index, 1);
			}
		}
	};
</script>

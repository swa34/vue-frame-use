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
					<input type="text" v-model="record.AUP_NUMBER" required />
				</label>
			</p>
			<p>
				<label>
					<h4>{{ columns.NUMBER.prettyName }}</h4>
					<input type="text" v-model="record.NUMBER" />
				</label>
			</p>
			<p>
				<label>
					<h4>{{ columns.DESCRIPTION.prettyName }}</h4>
					<input type="text" v-model="record.DESCRIPTION" />
				</label>
			</p>
			<p>
				<label>
					<h4>{{ columns.SOURCE.prettyName }}</h4>
					<input type="text" v-model="record.SOURCE" />
				</label>
			</p>
			<p>
				<label>
					<h4>{{ columns.FINAL_DISPOSITION.prettyName }}</h4>
					<input type="text" v-model="record.FINAL_DISPOSITION" />
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
					<input type="text" v-model="record.TOTAL_FEED_AMOUNT" />
				</label>
			</p>
			<p>
				<label>
					<h4>{{ columns.FEED_STORAGE_LOCATION.prettyName }}</h4>
					<input type="text" v-model="record.FEED_STORAGE_LOCATION" />
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
	import supplementalAnimalInfoSchema from '@/schemas/caes_research_farm_project/supplemental_animal_info';
	import { getObjectIndexedByKeyFromArray } from '@/modules/utilities';

	export default {
		name: 'SupplementalAnimalInfo',
		computed: {
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
		data () {
			return {
				columns: getObjectIndexedByKeyFromArray(supplementalAnimalInfoSchema.columns, 'columnName'),
				localRecord: supplementalAnimalInfoSchema.columns.reduce((out, column) => {
					out[column.columnName] = null;
					return out;
				}, {}),
				responsiblePartyOptions: caesCache.data.crfp.responsibleParty,
				schema: supplementalAnimalInfoSchema
			};
		},
		mounted () {
			let records = this.$store.state.supplementalAnimalInformation.records;
			if (records.length < 1) {
				records.push(this.localRecord);
			} else {
				this.localRecord = records[0];
			}
		},
		props: {
			mode: {
				type: String,
				required: true
			}
		}
	};
</script>

<template lang="html">
	<div>
		<h3 v-if="title || schema.title">
			{{ title || schema.title }}
			<a v-if="helpMessageName && allowEdit" class="help-link" @click="$emit('show-help')">
				<HelpCircleIcon />
			</a>
		</h3>
		<p v-if="description">
			{{ description }}
		</p>
		<table v-if="schema.columns">
			<thead>
				<tr>
					<th v-for="column in columnsToBeDisplayed" :key="column.columnName">
						{{ column.prettyName || getPrettyColumnName(column.columnName) }}
					</th>
					<th v-if="mode === 'edit' && (allowEdit || allowInsert) && !schema.disableUpdate && !schema.disableInsert">
						<!--
							No content here, just need empty space for the 'save field' column
						-->
					</th>
				</tr>
			</thead>
			<transition-group name="list-complete" tag="tbody">
				<tr v-for="(record, index) in records" :key="`record-${index}`" class="list-complete-item">
					<td v-for="column in columnsToBeDisplayed" :key="column.columnName">
						<label v-if="allowEdit && columnShouldBeEditable(column)">
							<textarea v-if="column.inputType === 'textarea' || sqlToHtml(column) === 'textarea'" v-model="record[column.columnName]" :disabled="column.immutable"></textarea>
							<FuzzySelect
								v-else-if="column.inputType === 'fuzzyselect' || sqlToHtml(column) === 'fuzzyselect'"
								v-model="record[column.columnName]"
								:options="column.constraint.values"
							/>
							<select v-else-if="column.inputType === 'select' || sqlToHtml(column) === 'select'" v-model="record[column.columnName]" :disabled="column.immutable">
								<option v-for="value in column.constraint.values" :key="value.key" :value="value.key">
									{{ value.label }}
								</option>
							</select>
							<input
								v-else-if="column.inputType === 'number' || sqlToHtml(column) === 'number'"
								v-model.number="record[column.columnName]"
								type="number"
								:min="column.min || 0"
								:disabled="column.immutable"
							/>
							<input
								v-else
								v-model="record[column.columnName]"
								:type="column.inputType || sqlToHtml(column)"
								:disabled="column.immutable"
							/>
						</label>
						<div v-else>
							<span v-if="column.inputType === 'select' || sqlToHtml(column) === 'select'">
								{{ column.constraint.values[column.constraint.values.map(v => v.key).indexOf(record[column.columnName])].label }}
							</span>
							<span v-else>
								{{ record[column.columnName] }}
							</span>
						</div>
					</td>
					<td v-if="allowEdit && !schema.disableUpdate">
						<button
							v-if="!$store"
							type="button"
							class="button"
							@click="updateRecord(record)"
						>
							Save
						</button>
						<button type="button" class="button red" @click="deleteRecord(record)">
							Remove
						</button>
					</td>
					<td v-else-if="allowInsert && allowEdit && !schema.disableInsert">
						<!--
							No content here, just need empty space for the 'save field' column
						-->
					</td>
				</tr>
				<tr v-if="allowInsert && allowEdit && !schema.disableInsert && (!recordLimit || records.length < recordLimit)" :key="'new-record'">
					<td v-for="column in columnsToBeDisplayed" :key="column.columnName">
						<label>
							<textarea v-if="column.inputType === 'textarea' || sqlToHtml(column) === 'textarea'" v-model="newRecord[column.columnName]" :disabled="!columnShouldBeEditable(column)"></textarea>
							<FuzzySelect
								v-else-if="column.inputType === 'fuzzyselect' || sqlToHtml(column) === 'fuzzyselect'"
								v-model="newRecord[column.columnName]"
								:options="column.constraint.values"
							/>
							<select v-else-if="column.inputType === 'select' || sqlToHtml(column) === 'select'" v-model="newRecord[column.columnName]" :disabled="!columnShouldBeEditable(column)">
								<option v-for="value in column.constraint.values" :key="value.key" :value="value.key">
									{{ value.label }}
								</option>
							</select>
							<input
								v-else-if="column.inputType === 'number' || sqlToHtml(column) === 'number'"
								v-model="newRecord[column.columnName]"
								type="number"
								:min="column.min || 0"
								:disabled="!columnShouldBeEditable(column)"
							/>
							<input
								v-else
								v-model="newRecord[column.columnName]"
								:type="column.inputType || sqlToHtml(column)"
								:disabled="!columnShouldBeEditable(column)"
							/>
						</label>
					</td>
					<td>
						<button type="button" class="button" @click="addNewRecord">
							Add
						</button>
					</td>
				</tr>
			</transition-group>
		</table>
		<p v-if="description">
			{{ description }}
		</p>
	</div>
</template>

<script>
	/* global activeUserID */
	import FuzzySelect from '~/views/elements/FuzzySelect';
	import HelpCircleIcon from 'vue-feather-icons/icons/HelpCircleIcon';
	import {
		getCriteriaStructure,
		logError
	} from '~/modules/caesdb';
	import {
		formatDates,
		getPrettyColumnName,
		modeValidator,
		sqlToHtml,
		stringFormats
	} from '~/modules/utilities';

	export default {
		name: 'DataTable',
		components: {
			FuzzySelect,
			HelpCircleIcon
		},
		props: {
			'allowInsert': {
				type: Boolean
			},
			'associatedColumn': {
				type: String,
				default: ''
			},
			'description': {
				type: String,
				default: ''
			},
			'fieldsToDisplay': {
				type: Array,
				default: () => []
			},
			'fieldsToEdit': {
				type: Array,
				default: () => []
			},
			'helpMessageName': {
				type: String,
				default: ''
			},
			'identifier': {
				type: Object,
				default: null
			},
			'mode': {
				type: String,
				default: 'view',
				validator: modeValidator
			},
			'recordLimit': {
				type: Number,
				default: 0
			},
			'schema': {
				type: Object,
				required: true
			},
			'title': {
				type: String,
				default: ''
			}
		},
		data () {
			let newRecord = {};
			this.schema.columns.forEach((column) => {
				newRecord[column.columnName] = !this.identifier.duplicate && this.identifier.key && this.identifier.value && this.identifier.key === column.columnName ? this.identifier.value : column.default || null;
			});
			return {
				localRecords: [],
				associations: [],
				newRecord,
				dateFields: []
			};
		},
		computed: {
			allowEdit () { return this.mode === 'edit'; },
			columnsToBeDisplayed () {
				return this.schema.columns.filter(column => this.columnShouldBeDisplayed(column));
			},
			duplication () {
				return this.$store.state.duplication;
			},
			fetched: {
				get () { return this.$store.state[stringFormats.camelCase(this.title || this.schema.title)].fetched; },
				set (val) { this.$store.state[stringFormats.camelCase(this.title || this.schema.title)].fetched = val; }
			},
			records: {
				get () {
					return this.$store ? this.$store.state[stringFormats.camelCase(this.title || this.schema.title)].records : this.localRecords;
				},
				set (val) {
					if (this.$store) {
						this.$store.state[stringFormats.camelCase(this.title || this.schema.title)].records = val;
					} else {
						this.localRecords = val;
					}
				}
			}
		},
		watch: {
			duplication: {
				handler () {
					if (this.identifier.duplicate && this.duplication.associations[stringFormats.camelCase(this.title || this.schema.title)]) {
						this.getMainData();
					}
				},
				deep: true
			}
		},
		mounted () {
			const component = this;

			component.schema.columns.forEach((column) => {
				if (sqlToHtml(column) === 'date') this.dateFields.push(column.columnName);
			});

			const getConstraintData = () => {
				component.schema.columns.forEach((column) => {
					if (column.constraint && column.constraint.values && column.constraint.values.length > 0) {
						let values = [];
						column.constraint.values.forEach((result) => {
							let value = null;
							if (column.constraint.generateValue) {
								value = column.constraint.generateValue(result);
							} else {
								if (result.originalValue) {
									value = result;
								} else {
									value = {
										key: result[column.constraint.foreignKey],
										label: column.constraint.foreignLabel ? result[column.constraint.foreignLabel] : result[column.constraint.foreignKey]
									};
								}
							}
							values.push(value);
						});
						column.constraint.values = values;
					} else if (column.constraint && column.constraint.getValues) {
						if (column.constraint.tablePrefix) {
							// If the constraint has a tablePrefix, we need to get a criteria
							// structure first, then send our request
							getCriteriaStructure(column.constraint.databaseName, column.constraint.tablePrefix, (err, criteriaStructure) => {
								if (err) logError(err);
								criteriaStructure[column.constraint.criteria.string] = column.constraint.criteria.useUserID ? activeUserID : column.constraint.criteria.value;
								column.constraint.getValues(criteriaStructure, (err, data) => {
									if (err) logError(err);
									if (data) column.constraint.values = data;
								});
							});
						} else {
							// If no table prefix, just fetch the data
							column.constraint.getValues((err, data) => {
								if (err) logError(err);
								if (data) {
									let values = [];
									data.forEach((result) => {
										let value = null;
										if (column.constraint.generateValue) {
											value = column.constraint.generateValue(result);
										} else {
											value = {
												key: result[column.constraint.foreignKey],
												label: column.constraint.foreignLabel ? result[column.constraint.foreignLabel] : result[column.constraint.foreignKey],
												originalValue: result
											};
										}
										values.push(value);
									});
									column.constraint.values = values.sort((a, b) => {
										if (a.label > b.label) return 1;
										if (a.label === b.label) return 0;
										return -1;
									});
								}
							});
						}
					}
				});
			};
			if ((!component.identifier.duplicate && component.identifier.value) || (component.identifier.duplicate && this.duplication.associations[stringFormats.camelCase(this.title || this.schema.title)])) {
				if (!this.fetched) this.getMainData();
			}
			if (component.allowEdit || component.allowInsert) getConstraintData();
		},
		methods: {
			addNewRecord () {
				this.records.push(Object.assign({}, this.newRecord));
				for (let key in this.newRecord) {
					this.newRecord[key] = null;
				}
			},
			columnShouldBeDisplayed (column) {
				if (!this.identifier.value) {
					// If there's no identifier and the column is not the associated column
					if (column.columnName !== this.associatedColumn) {
						// Show it if it's not automated
						return !column.automated;
					} else {
						// Otherwise, don't
						return false;
					}
				} else {
					// If there is an identifier, then show the column if no fields to
					// display were passed in, or if inserting is allowed and the column
					// is required, or if fields to display were passed in and the column
					// is one of those fields.
					if (column.automated) return false;
					return !this.fieldsToDisplay || this.fieldsToDisplay.length < 1 || (this.allowInsert && column.required) || this.fieldsToDisplay.indexOf(column.columnName) !== -1;
				}
			},
			columnShouldBeEditable (column) {
				// Rules for column to be editable:
				// - No identifier specified OR Column is not identifier column
				// - No custom list of fields to edit OR column is present in custom
				// list
				return (!this.identifier.value || this.identifier.key !== column.columnName) && (this.fieldsToEdit.length === 0 || this.fieldsToEdit.indexOf(column.columnName) !== -1);
			},
			deleteRecord (record) {
				const index = this.records.indexOf(record);
				if (index !== -1) {
					this.records.splice(index, 1);
				}
			},
			getPrettyColumnName,
			sqlToHtml,
			updateRecord (record) {
				console.log('Sending data to server:');
				console.log(JSON.stringify(record, null, 2));
			},
			getMainData () {
				getCriteriaStructure(this.schema.databaseName, this.schema.tablePrefix, (err, data) => {
					if (err) logError(err);
					if (data) {
						let critStruct = data;
						critStruct[this.identifier.criteriaString] = this.identifier.value;
						this.schema.fetchExisting(critStruct, (err, data) => {
							if (err) logError(err);
							if (data) {
								this.records = data;
								if (this.dateFields.length > 0) formatDates(this.dateFields, this.records);
								if (this.identifier.duplicate) {
									this.records.forEach((record) => {
										if (record.ID) record.ID = null;
										record[this.associatedColumn] = null;
									});
								}
								this.fetched = true;
							}
						});
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.list-complete-item {
		transition: all .5s;
		display: table-row;
	}
	.list-complete-enter, .list-complete-leave-to {
		opacity: 0;
		transform: translateY(-1.5rem);
	}
	.list-complete-leave-active {
		position: absolute;
	}
</style>

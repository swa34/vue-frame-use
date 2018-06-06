<template lang="html">
	<div>
		<table v-if="schema.columns">
			<caption v-if="title || schema.title">
				{{ title || schema.title }}
			</caption>
			<thead>
				<tr>
					<th v-for="column in schema.columns" v-if="columnShouldBeDisplayed(column)">
						{{ column.prettyName || getPrettyColumnName(column.columnName) }}
					</th>
					<th v-if="(allowEdit || allowInsert) && !schema.disableUpdate && !schema.disableInsert">
						<!--
							No content here, just need empty space for the 'save field' column
						-->
					</th>
				</tr>
			</thead>
			<transition-group name="list-complete" tag="tbody">
				<tr v-for="record in records" v-bind:key="record" class="list-complete-item">
					<td v-for="column in schema.columns" v-if="columnShouldBeDisplayed(column)">
						<label v-if="allowEdit && columnShouldBeEditable(column)">
							<textarea v-if="column.inputType === 'textarea' || sqlToHtml(column) === 'textarea'" v-model="record[column.columnName]" :disabled="column.immutable"></textarea>
							<select v-else-if="column.inputType === 'select' || sqlToHtml(column) === 'select'" v-model="record[column.columnName]" :disabled="column.immutable">
								<option v-for="value in column.constraint.values" :value="value.key">
									{{ value.label }}
								</option>
							</select>
							<input v-else :type="column.inputType || sqlToHtml(column)" v-model="record[column.columnName]" :disabled="column.immutable" />
						</label>
						<span v-else>
							{{ record[column.columnName] }}
						</span>
					</td>
					<td v-if="allowEdit && !schema.disableUpdate">
						<button v-if="!$store" v-on:click="updateRecord(record)" class="button">
							Save
						</button>
						<button v-on:click="deleteRecord(record)" class="button red">
							Delete
						</button>
					</td>
					<td v-else-if="allowInsert && !schema.disableInsert">
						<!--
							No content here, just need empty space for the 'save field' column
						-->
					</td>
				</tr>
				<tr v-if="allowInsert && !schema.disableInsert" v-bind:key="-1">
					<td v-for="column in schema.columns" v-if="columnShouldBeDisplayed(column)">
						<label>
							<textarea v-if="column.inputType === 'textarea' || sqlToHtml(column) === 'textarea'" v-model="newRecord[column.columnName]" :disabled="!columnShouldBeEditable(column)"></textarea>
							<select v-else-if="column.inputType === 'select' || sqlToHtml(column) === 'select'" v-model="newRecord[column.columnName]" :disabled="!columnShouldBeEditable(column)">
								<option v-for="value in column.constraint.values" :value="value.key">
									{{ value.label }}
								</option>
							</select>
							<input v-else :type="column.inputType || sqlToHtml(column)" v-model="newRecord[column.columnName]" :disabled="!columnShouldBeEditable(column)" />
						</label>
					</td>
					<td>
						<button v-on:click="addNewRecord" class="button">
							Add
						</button>
					</td>
				</tr>
			</transition-group>
		</table>
		<pre v-if="!$store">{{ $data }}</pre>
	</div>
</template>

<script>
	/* global activeUserID */
	import { getCriteriaStructure } from '@/modules/caesdb';
	import {
		// formatDates,
		getPrettyColumnName,
		sqlToHtml,
		stringFormats
	} from '@/modules/utilities';

	export default {
		name: 'DataTable',
		computed: {
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
		data () {
			let newRecord = {};
			this.schema.columns.forEach((column) => {
				newRecord[column.columnName] = this.identifier.key && this.identifier.value && this.identifier.key === column.columnName ? this.identifier.value : null;
			});
			return {
				localRecords: [],
				associations: [],
				newRecord
			};
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
					return !this.fieldsToDisplay || (this.allowInsert && column.required) || this.fieldsToDisplay.indexOf(column.columnName) !== -1;
				}
			},
			columnShouldBeEditable (column) {
				// Column is only editable if the fieldsToEdit array exists and contains
				// the column's name
				return (!this.identifier.value || this.identifier.key !== column.columnName) && (!this.fieldsToEdit || this.fieldsToEdit.indexOf(column.columnName) !== -1);
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
			}
		},
		mounted () {
			const component = this;

			let dateFields = [];
			component.schema.columns.forEach((column) => {
				if (sqlToHtml(column) === 'date') dateFields.push(column.columnName);
			});

			// const getMainData = () => {
			// 	const options = {
			// 		db: component.schema.database,
			// 		table: component.schema.table,
			// 		identifier: component.identifier
			// 	};
			// 	caesdb.getData(options, (err, data) => {
			// 		if (err) console.error(err);
			// 		if (data.success) {
			// 			component.records = data.results;
			// 			if (dateFields.length > 0) formatDates(dateFields, component.records);
			// 		}
			// 	});
			// };

			const getConstraintData = () => {
				component.schema.columns.forEach((column) => {
					if (column.constraint && column.constraint.getValues) {
						if (column.constraint.tablePrefix) {
							// If the constraint has a tablePrefix, we need to get a criteria
							// structure first, then send our request
							getCriteriaStructure(column.constraint.tablePrefix, (err, criteriaStructure) => {
								if (err) console.error(err);
								criteriaStructure[column.constraint.criteria.string] = column.constraint.criteria.useUserID ? activeUserID : column.constraint.criteria.value;
								column.constraint.getValues(criteriaStructure, (err, data) => {
									if (err) console.error(err);
									if (data) column.constraint.values = data;
								});
							});
						} else {
							// If no table prefix, just fetch the data
							column.constraint.getValues((err, data) => {
								if (err) console.error(err);
								if (data) {
									data.forEach((result) => {
										const value = {
											key: result[column.constraint.foreignKey],
											label: column.constraint.foreignLabel ? result[column.constraint.foreignLabel] : result[column.constraint.foreignKey]
										};
										column.constraint.values.push(value);
									});
								}
							});
						}
					}
				});
			};
			// if (component.identifier.key && component.identifier.value) getMainData();
			if (component.allowEdit || component.allowInsert) getConstraintData();
		},
		props: {
			'allowEdit': {
				type: Boolean
			},
			'allowInsert': {
				type: Boolean
			},
			'associatedColumn': {
				type: String
			},
			'fieldsToDisplay': {
				type: Array
			},
			'fieldsToEdit': {
				type: Array
			},
			'identifier': {
				type: Object
			},
			'schema': {
				type: Object,
				required: true
			},
			'title': {
				type: String
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

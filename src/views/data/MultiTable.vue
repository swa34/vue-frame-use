<template lang="html">
  <div>
		<table v-if="schema.columns && records.length > 0">
			<caption v-if="title || schema.title">
				{{ title || schema.title }}
			</caption>
			<thead>
				<tr>
					<th v-for="column in filteredColumns">
						{{ column.prettyName || getPrettyColumnName(column.columnName) }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="record in records" v-bind:key="record[optionColumnName]">
					<td v-for="column in filteredColumns">
						<span v-if="column.columnName === optionColumnName">
							{{ getOptionLabel(record[optionColumnName]) }}
						</span>
						<label v-else-if="allowEdit && columnShouldBeEditable(column)">
							<select v-if="sqlToHtml(column) === 'select'" v-model="record[column.columnName]" :disabled="column.immutable">
								<option v-for="value in column.constraint.values" :value="value.key">
									{{ value.label }}
								</option>
							</select>
							<input v-else-if="sqlToHtml(column) === 'number'" type="number" v-model.number="record[column.columnName]" :min="column.min" :disabled="column.immutable" />
							<input v-else :type="sqlToHtml(column)" v-model="record[column.columnName]" :disabled="column.immutable" />
						</label>
						<span v-else>
							{{ getRecordValue(option, column) }}
						</span>
					</td>
				</tr>
			</tbody>
			<tfoot v-if="showTotals">
				<tr>
					<td v-for="(column, index) in filteredColumns">
						<span v-if="index === 0">
							Total
						</span>
						<span v-else-if="sqlToHtml(column) === 'number'">
							{{ getSum(column) }}
						</span>
						<span v-else>
							&nbsp;
						</span>
					</td>
				</tr>
			</tfoot>
		</table>
	</div>
</template>

<script>
	import { getCriteriaStructure } from '@/modules/caesdb';
	import { filter } from '@/modules/criteriaUtils';
	import {
		// formatDates,
		getPrettyColumnName,
		sqlToHtml,
		stringFormats
	} from '@/modules/utilities';

	export default {
		name: 'DataMultiTable',
		computed: {
			filteredColumns: {
				get () {
					let filteredColumns = [];
					this.schema.columns.forEach((column) => {
						if (this.columnShouldBeDisplayed(column)) filteredColumns.push(column);
					});
					return filteredColumns;
				}
			},
			filteredOptions: {
				get () {
					// If no filter was specified, return the unfiltered options
					if (!this.filter) return this.options;
					// We need to make sure that all specified associations are satisfied
					// before we show any options, so we create this int to count as we
					// process associations
					let associationsSelected = 0;
					// Loop through each of the filter's associations, so that we can
					// populate the filter's criteria structure
					this.filter.associations.forEach((association) => {
						// Create an array to hold that association's values
						let associatedValues = [];
						// Get the records from the specified association in the store
						this.$store.state[stringFormats.camelCase(association.title)].records.forEach((record) => {
							// If our associated values array doesn't have the record yet, add
							// it.
							if (associatedValues.indexOf(record[association.column]) === -1) associatedValues.push(record[association.column]);
						});
						// If values have been set on the association, then we can assume
						// we've successfully processed that association.  So, increment our
						// counter.
						if (associatedValues.length > 0) associationsSelected++;
						// And push those values the criteria structure specified in the
						// filter.
						this.filter.criteriaStructure['criteria_' + (association.criteriaColumn || association.column) + '_eq'] = associatedValues;
					});
					// Once our criteria structure is populated with values, run
					// the filter function to get the filtered records.
					const filteredRecords = filter(this.filterRecords, this.filter.criteriaStructure);
					// Then grab the values from those filtered records.
					const filteredValues = filteredRecords.map(r => r[this.filter.optionColumn]);
					// Create an empty array to hold them
					const filteredOptions = [];
					// Loop through each of the options
					this.options.forEach((option) => {
						// And if the option's value is in the filteredValues array, push
						// the option into our filtered options array
						if (filteredValues.indexOf(option.key) !== -1) filteredOptions.push(option);
					});
					// If our counter says we've got all the data for all associations,
					// return our filtered options.  If all associations have not been
					// satisfied, return an empty array.
					return associationsSelected === this.filter.associations.length ? filteredOptions : [];
				}
			},
			optionColumn: {
				get () {
					for (let i = 0; i < this.schema.columns.length; ++i) {
						const column = this.schema.columns[i];
						if (column.columnName === this.optionColumnName) return column;
						if (i === this.schema.columns.length - 1) {
							console.error('Could not find option column');
							return null;
						}
					}
				}
			},
			options: {
				get () {
					return this.optionColumn.constraint.values;
				}
			},
			records: {
				get () {
					return this.$store ? this.$store.state[stringFormats.camelCase(this.title || this.schema.title)].records : this.localRecords;
				},
				set (val) {
					if (this.$store) {
						this.$store.commit(stringFormats.camelCase(this.title || this.schema.title) + '/setRecords', {
							records: val
						});
						// Vue.set(this.$store.state[stringFormats.camelCase(this.title || this.schema.title)], 'records', val);
						// this.$store.state[stringFormats.camelCase(this.title || this.schema.title)].records = val;
					} else {
						this.localRecords = val;
					}
				}
			}
		},
		data () {
			return {
				criteriaStructure: {},
				filterRecords: [],
				localRecords: []
			};
		},
		methods: {
			columnShouldBeDisplayed (column) {
				if (!this.identifier.value) {
					// If there's no identifier and the column is not the associated column
					if (column.columnName !== this.associatedColumn) {
						// Show it
						return true;
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
			generateRecord (option) {
				// Create the record object
				const record = {};
				// Then loop through the schema's columns to set the appropriate values
				// in the record.
				this.schema.columns.forEach((column) => {
					if (column.columnName === this.optionColumnName) {
						record[column.columnName] = option.key;
					} else {
						record[column.columnName] = this.identifier.value || null;
					}
				});
				// Then return the record
				return record;
			},
			getOptionLabel (key) {
				const optionKeys = this.filteredOptions.map(o => o.key);
				const optionLabels = this.filteredOptions.map(o => o.label);
				return optionLabels[optionKeys.indexOf(key)];
			},
			getPrettyColumnName,
			getRecordValue (option, column) {
				let value = null;
				this.records.forEach((record) => {
					if (record[this.optionColumnName] === option[this.optionColumn.constraint.foreignKey]) value = record[column.columnName];
				});
				return value;
			},
			getSum (column) {
				let sum = 0;
				this.records.forEach((record) => {
					sum += typeof record[column.columnName] === 'number' ? record[column.columnName] : 0;
				});
				return sum;
			},
			sqlToHtml
		},
		mounted () {
			const component = this;

			let dateFields = [];
			component.schema.columns.forEach((column) => {
				if (sqlToHtml(column) === 'date') dateFields.push(column.columnName);
			});

			const getFilterRecords = () => {
				if (component.filter.getValues) {
					component.filter.getValues((err, data) => {
						if (err) console.error(err);
						if (data) component.filterRecords = data;
					});
				} else {
					console.error('Filter does not contain function to get values');
				}
			};

			const getConstraintData = () => {
				component.schema.columns.forEach((column) => {
					if (column.constraint && column.constraint.values && column.constraint.values.length < 1 && column.constraint.getValues) {
						column.constraint.getValues((err, data) => {
							if (err) console.error(err);
							if (data) {
								data.forEach((result) => {
									const value = {
										key: result[column.constraint.foreignKey],
										label: column.constraint.foreignLabel ? result[column.constraint.foreignLabel] : result[column.constraint.foreignKey],
										originalValue: result
									};
									column.constraint.values.push(value);
								});
							}
						});
					}
				});
			};

			const fetchCriteriaStructure = () => {
				getCriteriaStructure(component.filter.tablePrefix, (err, data) => {
					if (err) console.error(err);
					if (data) {
						component.criteriaStructure = data;
					}
				});
			};

			if (component.allowEdit) getConstraintData();
			if (component.filter) {
				getFilterRecords();
				if (component.filter.fetchCriteriaStructure) fetchCriteriaStructure();
			}
		},
		props: {
			'allowEdit': {
				type: Boolean
			},
			'associatedColumn': {
				type: String
			},
			'filter': {
				type: Object
			},
			'identifier': {
				type: Object
			},
			'optionColumnName': {
				type: String,
				required: true
			},
			'schema': {
				type: Object,
				required: true
			},
			'showTotals': {
				type: Boolean
			},
			'title': {
				type: String
			}
		},
		watch: {
			filteredOptions () {
				const populateRecords = () => {
					this.filteredOptions.forEach((option) => {
						this.records.push(this.generateRecord(option));
					});
				};

				const updateRecords = () => {
					const records = [];
					// const optionsMap = this.filteredOptions.map(o => o.key);
					const recordsMap = this.records.map(r => r[this.optionColumnName]);
					this.filteredOptions.forEach((option) => {
						const record = this.generateRecord(option);
						const existingRecord = this.records[recordsMap.indexOf(option.key)];
						for (let key in existingRecord) {
							if (key !== this.optionColumnName && existingRecord[key] !== null) record[key] = existingRecord[key];
						}
						records.push(record);
					});
					this.records = records;
				};

				this.records.length > 0 ? updateRecords() : populateRecords();
			}
		}
	};
</script>

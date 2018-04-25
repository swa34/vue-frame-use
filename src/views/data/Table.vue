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
			<tbody>
				<tr v-for="record in records">
					<td v-for="column in schema.columns" v-if="columnShouldBeDisplayed(column)">
						<label v-if="allowEdit && columnShouldBeEditable(column)">
							<select v-if="sqlToHtml(column) === 'select'" v-model="record[column.columnName]" :disabled="column.immutable">
								<option v-for="value in column.constraint.values" :value="value.key">
									{{ value.label }}
								</option>
							</select>
							<input v-else :type="sqlToHtml(column)" v-model="record[column.columnName]" :disabled="column.immutable" />
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
				<tr v-if="allowInsert && !schema.disableInsert">
					<td v-for="column in schema.columns" v-if="columnShouldBeDisplayed(column)">
						<label>
							<textarea v-if="sqlToHtml(column) === 'textarea'" v-model="newRecord[column.columnName]" :disabled="!columnShouldBeEditable(column)"></textarea>
							<select v-else-if="sqlToHtml(column) === 'select'" v-model="newRecord[column.columnName]" :disabled="!columnShouldBeEditable(column)">
								<option v-for="value in column.constraint.values" :value="value.key">
									{{ value.label }}
								</option>
							</select>
							<input v-else :type="sqlToHtml(column)" v-model="newRecord[column.columnName]" :disabled="!columnShouldBeEditable(column)" />
						</label>
					</td>
					<td>
						<button v-on:click="addNewRecord" class="button">
							Add
						</button>
					</td>
				</tr>
			</tbody>
		</table>
		<pre v-if="!$store">{{ $data }}</pre>
	</div>
</template>

<script>
	import caesdb from '@/modules/caesdb';
	import {
		formatDates,
		getPrettyColumnName,
		sqlToHtml,
		stringFormats
	} from '@/modules/utilities';

	export default {
		name: 'DataTable',
		props: {
			'title': {
				type: String
			},
			'schema': {
				type: Object,
				required: true
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
			'allowEdit': {
				type: Boolean
			},
			'allowInsert': {
				type: Boolean
			},
			'identifier': {
				type: Object
			}
		},
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

			const getMainData = () => {
				const options = {
					db: component.schema.database,
					table: component.schema.table,
					identifier: component.identifier
				};
				caesdb.getData(options, (err, data) => {
					if (err) console.error(err);
					if (data.success) {
						component.records = data.results;
						if (dateFields.length > 0) formatDates(dateFields, component.records);
					}
				});
			};

			const getConstraintData = () => {
				component.schema.columns.forEach((column) => {
					if (column.constraint) {
						const options = {
							db: column.constraint.database,
							table: column.constraint.table
						};
						caesdb.getData(options, (err, data) => {
							if (err) console.error(err);
							if (data.success) {
								data.results.forEach((result) => {
									const value = {
										key: result[column.constraint.foreignKey],
										label: column.constraint.foreignLabel ? result[column.constraint.foreignLabel] : result[column.constraint.foreignKey]
									};
									column.constraint.values.push(value);
								});
							}
						});
					}
				});
			};
			if (component.identifier.key && component.identifier.value) getMainData();
			if (component.allowEdit || component.allowInsert) getConstraintData();
		}
	};
</script>

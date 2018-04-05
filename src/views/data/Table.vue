<template lang="html">
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
						<input v-else :type="sqlToHtml(column)" v-model="record[column.columnName]" :disabled="column.immutable"/>
					</label>
					<span v-else>
						{{ record[column.columnName] }}
					</span>
				</td>
				<td v-if="allowEdit && !schema.disableUpdate">
					<button class="button">
						Save
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
					<button class="button">
						Add
					</button>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
	import caesdb from '@/modules/caesdb';
	import { formatDates, getPrettyColumnName, sqlToHtml } from '@/modules/utilities';

	export default {
		name: 'DataTable',
		props: [
			'title',
			'schema',
			'fieldsToDisplay',
			'fieldsToEdit',
			'allowEdit',
			'allowInsert',
			'identifier'
		],
		data () {
			let newRecord = {};
			this.schema.columns.forEach((column) => {
				newRecord[column.columnName] = this.identifier.key && this.identifier.value && this.identifier.key === column.columnName ? this.identifier.value : null;
			});
			return {
				records: [],
				associations: [],
				newRecord
			};
		},
		methods: {
			columnShouldBeDisplayed (column) {
				// If fields to display is null, show it, otherwise only show it if its
				// name is in the fieldsToDisplay array
				return !this.fieldsToDisplay || (this.allowInsert && column.required) || this.fieldsToDisplay.indexOf(column.columnName) !== -1;
			},
			columnShouldBeEditable (column) {
				// Column is only editable if the fieldsToEdit array exists and contains
				// the column's name
				return (!this.identifier.value || this.identifier.key !== column.columnName) && (!this.fieldsToEdit || this.fieldsToEdit.indexOf(column.columnName) !== -1);
			},
			getPrettyColumnName,
			sqlToHtml
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
			getMainData();
			if (component.allowEdit || component.allowInsert) getConstraintData();
		}
	};
</script>

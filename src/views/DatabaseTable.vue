<template lang="html">
	<table v-if="schema.columns">
		<thead>
			<tr>
				<th v-for="column in schema.columns" v-if="columnShouldBeDisplayed(column)">
					{{ column.prettyName || getPrettyColumnName(column.columnName) }}
				</th>
				<th v-if="allowEdit || allowInsert">
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
						<textarea v-if="sqlToHtml(column) === 'textarea'" v-model="record[column.columnName]" :disabled="column.immutable">
							{{ record[column.columnName] }}
						</textarea>
						<select v-else-if="sqlToHtml(column) === 'select'" v-model="record[column.columnName]" :disabled="column.immutable">
							<option v-for="value in column.association.values" :value="value.key">
								{{ value.label }}
							</option>
						</select>
						<input v-else :type="sqlToHtml(column)" v-model="record[column.columnName]" :disabled="column.immutable"/>
					</label>
					<span v-else>
						{{ record[column.columnName] }}
					</span>
				</td>
				<td v-if="allowEdit">
					<button class="button">
						Save
					</button>
				</td>
				<td v-else-if="allowInsert">
					<!--
						No content here, just need empty space for the 'save field' column
					-->
				</td>
			</tr>
			<tr v-if="allowInsert">
				<td v-for="column in schema.columns" v-if="columnShouldBeDisplayed(column)">
					<label v-if="columnShouldBeEditable(column)">
						<textarea v-if="sqlToHtml(column) === 'textarea'" v-model="newRecord[column.columnName]"></textarea>
						<select v-else-if="sqlToHtml(column) === 'select'" v-model="newRecord[column.columnName]">
							<option v-for="value in column.association.values" :value="value.key">
								{{ value.label }}
							</option>
						</select>
						<input v-else :type="sqlToHtml(column)" v-model="newRecord[column.columnName]" />
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
	import { getPrettyColumnName, sqlToHtml } from '@/modules/utilities';

	export default {
		name: 'DatabaseTable',
		props: [
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
				newRecord[column.columnName] = null;
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
				return !this.fieldsToEdit || this.fieldsToEdit.indexOf(column.columnName) !== -1;
			},
			getPrettyColumnName,
			sqlToHtml
		},
		mounted () {
			const component = this;
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
					}
				});
			};
			const getAssociationData = () => {
				component.schema.columns.forEach((column) => {
					if (column.association) {
						const options = {
							db: column.association.database,
							table: column.association.table
						};
						caesdb.getData(options, (err, data) => {
							if (err) console.error(err);
							if (data.success) {
								data.results.forEach((result) => {
									const value = {
										key: result[column.association.foreignKey],
										label: column.association.foreignLabel ? result[column.association.foreignLabel] : result[column.association.foreignKey]
									};
									column.association.values.push(value);
								});
							}
						});
					}
				});
			};
			getMainData();
			if (component.allowEdit || component.allowInsert) getAssociationData();
		}
	};
</script>

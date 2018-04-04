<template lang="html">
	<form>
		<fieldset v-for="column in schema.columns" v-if="!column.immutable">
			<label>
				<legend>
					{{ column.prettyName || getPrettyColumnName(column.columnName) }}
				</legend>
				<textarea v-if="sqlToHtml(column) === 'textarea'" v-model="record[column.columnName]">
					{{ record[column.columnName] }}
				</textarea>
				<select v-else-if="sqlToHtml(column) === 'select'" v-model="record[column.columnName]">
					<option v-for="value in column.association.values" :value="value.key">
						{{ value.label }}
					</option>
				</select>
				<input v-else :type="sqlToHtml(column)" v-model="record[column.columnName]" />
			</label>
		</fieldset>
		<input class="button" value="Save" type="submit" />
	</form>
</template>

<script>
	import caesdb from '@/modules/caesdb';
	import { getPrettyColumnName, sqlToHtml } from '@/modules/utilities';
	export default {
		name: 'DatabaseForm',
		props: [
			'schema',
			'identifier'
		],
		data () {
			let record = {};
			this.schema.columns.forEach((column) => {
				record[column.columnName] = null;
			});
			return {
				record
			};
		},
		methods: {
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
						component.record = data.results[0];
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

			if (component.identifier && component.identifier.value) getMainData();
			getAssociationData();
		}
	};
</script>

<template lang="html">
	<form>
		<fieldset v-for="column in schema.columns">
			<label>
				<legend>
					{{ column.prettyName || getPrettyColumnName(column.columnName) }}
				</legend>
				<textarea v-if="sqlToHtml(column) === 'textarea'" v-model="record[column.columnName]" :required="column.required" :disabled="column.immutable">
					{{ record[column.columnName] }}
				</textarea>
				<select v-else-if="sqlToHtml(column) === 'select'" v-model="record[column.columnName]" :required="column.required" :disabled="column.immutable">
					<option v-for="value in column.constraint.values" :value="value.key">
						{{ value.label }}
					</option>
				</select>
				<input v-else :type="sqlToHtml(column)" v-model="record[column.columnName]" :required="column.required" :disabled="column.immutable" />
			</label>
		</fieldset>
		<input v-if="!$store" class="button" value="Save" type="submit" />
	</form>
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
		name: 'DatabaseForm',
		props: {
			'schema': {
				type: Object,
				required: true
			},
			'identifier': {
				type: [
					Object,
					Boolean
				]
			}
		},
		computed: {
			record: {
				get () {
					return this.$store ? this.$store.state[stringFormats.camelCase(this.schema.title)] : this.localRecord;
				},
				set (val) {
					if (this.$store) {
						this.$store.state[stringFormats.camelCase(this.schema.title)] = val;
					} else {
						this.localRecord = val;
					}
				}
			}
		},
		data () {
			if (this.$store) {
				return {};
			} else {
				let localRecord = {};
				this.schema.columns.forEach((column) => {
					localRecord[column.columnName] = null;
				});
				return {
					localRecord
				};
			}
		},
		methods: {
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
						component.record = data.results[0];
						if (dateFields.length > 0) formatDates(dateFields, component.record);
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

			if (component.identifier && component.identifier.value) getMainData();
			getConstraintData();
		}
	};
</script>

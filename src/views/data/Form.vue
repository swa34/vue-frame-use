<template lang="html">
	<form>
		<!-- Loop through each of the columns specified in the schema -->
		<div v-for="column in schema.columns">
			<!--
				If the column should be displayed, create a fieldset to hold the fields
			-->
			<fieldset v-if="columnShouldBeDisplayed(column)">
				<label>
					<legend>
						<!--
							Show the column's pretty name if set, otherwise create a
							pretty-ish name from the column name
						-->
						{{ column.prettyName || getPrettyColumnName(column.columnName) }}
					</legend>
					<!--
						Pretty straightforward here: use the approriate input type depending
						on what type of data we're working with
					-->
					<textarea v-if="sqlToHtml(column) === 'textarea'" v-model="record[column.columnName]" :required="column.required" :disabled="column.immutable">
						{{ record[column.columnName] }}
					</textarea>
					<quillEditor
						v-else-if="column.inputType === 'richtext' || sqlToHtml(column) === 'richtext'"
						v-model="record[column.columnName]"
					/>
					<select v-else-if="sqlToHtml(column) === 'select'" v-model="record[column.columnName]" :required="column.required" :disabled="column.immutable">
						<option v-for="value in column.constraint.values" :value="value.key">
							{{ value.label }}
						</option>
					</select>
					<input v-else :type="sqlToHtml(column)" v-model="record[column.columnName]" :required="column.required" :disabled="column.immutable" />
				</label>
			</fieldset>
		</div>
		<!-- If no data store, add a button to update this record individually -->
		<input v-if="!$store" class="button" value="Save" type="submit" />
	</form>
</template>

<script>
	// Import required modules
	import caesdb from '@/modules/caesdb';
	import 'quill/dist/quill.core.css';
	import 'quill/dist/quill.snow.css';
	import 'quill/dist/quill.bubble.css';
	import {
		formatDates,
		getPrettyColumnName,
		sqlToHtml,
		stringFormats
	} from '@/modules/utilities';
	import { quillEditor } from 'vue-quill-editor';

	// Export the actual component
	export default {
		name: 'DatabaseForm',
		components: { quillEditor },
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
					// If there's a store, return the store's record, else just return the
					// local record.
					return this.$store ? this.$store.state[stringFormats.camelCase(this.schema.title)] : this.localRecord;
				},
				set (val) {
					// Similarly, if there's a store, set the store's record to the value,
					// and if not set the local record.
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
				// If using a store, return an empty object
				return {};
			} else {
				// If not using a store, create a local record and return that as the
				// only data member for the component.
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
			sqlToHtml,
			// A function to determine if a column should be displayed or not
			columnShouldBeDisplayed (column) {
				// Check if the column has a dependency
				if (!column.depends) {
					if ((!this.identifier || !this.identifier.key || (this.identifier.key && !this.identifier.value)) && column.automated) {
						// If no identifier was passed in, or no identifier key was passed
						// in, or if a key was passed in without a value, AND the column is
						// set as automated, don't show the column.
						return false;
					}
					// Otherwise, do.
					return true;
				} else {
					// If the column has a dependency, run the depend's test on the
					// specified value to determine if the column should be shown or not.
					return column.depends.test(this.record[column.depends.column]);
				}
			}
		},
		// The mounted function is run every time the component is loaded
		// ("mounted") on the page.
		mounted () {
			// Alias 'this' to component
			const component = this;

			// Create an empty array to hold encountered date fields.  Will be used
			// later to format SQL date values to the HTML standard
			let dateFields = [];
			// Then loop through each of the columns and push any date fields we find
			// into the array.
			component.schema.columns.forEach((column) => {
				if (sqlToHtml(column) === 'date') dateFields.push(column.columnName);
			});

			// Our main data grabbing function, grabs data for the main schema
			const getMainData = () => {
				// Options configuration for caesdb
				const options = {
					db: component.schema.database,
					table: component.schema.table,
					identifier: component.identifier
				};
				// Fetch the data
				caesdb.getData(options, (err, data) => {
					// Log an error if it exists
					if (err) console.error(err);
					// If everything went smoothly, set the component's record to the
					// fetched data, and then run our date formatter function (if needed)
					if (data.success) {
						component.record = data.results[0];
						if (dateFields.length > 0) formatDates(dateFields, component.record);
					}
				});
			};

			// Our constraint data grabbing function
			const getConstraintData = () => {
				// Loop through each of the schema's columns
				component.schema.columns.forEach((column) => {
					// If the column has a constraint specified, and a database specified
					// to get the data from
					if (column.constraint && column.constraint.database) {
						// Set up our options config
						const options = {
							db: column.constraint.database,
							table: column.constraint.table
						};
						// If an identifier is present, we need to pass it in to caesdb as
						// well.
						if (column.constraint.identifier) {
							if (typeof column.constraint.identifier.value !== 'object') {
								// If identifier value is not an object, we just use the value
								options.identifier = column.constraint.identifier;
							} else {
								// If it is an object, that means it depends on the value set
								// for a specific column, which is specified in the value field.
								// So, we construct an identifier using that information.
								options.identifier = {
									key: column.constraint.identifier.key,
									value: this.record[column.constraint.identifier.value.column]
								};
							}
						}
						// Finally, fetch the data
						caesdb.getData(options, (err, data) => {
							// Log an error if it exists
							if (err) console.error(err);
							// If the request was successful...
							if (data.success) {
								// Loop through each of the records returned
								data.results.forEach((result) => {
									// Turn the record into a value object
									const value = {
										key: result[column.constraint.foreignKey],
										label: column.constraint.foreignLabel ? result[column.constraint.foreignLabel] : result[column.constraint.foreignKey]
									};
									// Create a constraint values array if it doesn't have one
									if (!column.constraint.values) column.constraint.values = [];
									// And push it into the constraint's values array
									column.constraint.values.push(value);
								});
							}
						});
					}
				});
			};

			// If an identifier was specified, we need to fetch that record's data
			if (component.identifier && component.identifier.value) getMainData();
			// Regardless, get all column constraint data
			getConstraintData();
		}
	};
</script>

<style lang="scss" scoped>
	fieldset {
		border: none;
	}
</style>

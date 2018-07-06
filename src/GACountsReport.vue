<template lang="html">
  <div id="main">
		<DetailMain
			v-if="isNew || identifier !== null"
			:schema="schema"
			:identifier="identifier || false"
		/>
		<div v-else>
			<h2>
				Welcome to the GACounts Single-Page Report Entry
			</h2>
			<p>
				What would you like to do?
			</p>
			<form>
				<label>
					<button type="button" v-on:click="reloadPage">
						Enter a new report
					</button>
				</label>
				<p>
					-- or --
				</p>
				<fieldset>
					<label>
						<span>
							Enter a report ID to lookup an existing report
						</span>
						<input type="number" v-model="inputID" min="0" />
					</label>
					<label>
						<button type="button" v-on:click="reloadPage">
							Go
						</button>
					</label>
				</fieldset>
			</form>
		</div>
		<pre>{{ schemaLessStore }}</pre>
	</div>
</template>

<script>
	/* global notify */
	// Import required modules
	import { getComputed, getStore } from '@/modules/store';
	import { stringFormats, url } from '@/modules/utilities';
	import { getSortedSchema } from '@/modules/schemaTools';
	import DetailMain from '@/views/DetailMain';
	import schema from '@/schemas/gacounts3/report';

	// Hacky fix for schemas without titles
	if (!schema.title) schema.title = stringFormats.tableToTitle(schema.table);

	// Sort the schema
	const sortedSchema = getSortedSchema(schema);

	// Export the actual component
	export default {
		name: 'GACountsReport',
		components: { DetailMain },
		computed: {
			...getComputed(schema),
			fieldsToWatch () {
				let columns = [];
				let associations = [];
				// let subschemas = [];
				schema.columns.forEach((column) => {
					if (column.affects) {
						columns.push({
							name: column.columnName,
							value: this.$store.state[stringFormats.camelCase(this.schema.title)][column.columnName]
						});
					}
				});
				schema.associations.forEach((association) => {
					if (association.affects) {
						associations.push({
							title: association.title,
							records: this.$store.state[stringFormats.camelCase(association.title)].records
						});
					}
				});
				return {
					associations,
					columns
				};
			},
			schemaLessStore: {
				get () {
					let schemaLessStore = Object.assign({}, this.$store.state);
					delete schemaLessStore.schema;
					if (schemaLessStore.subschemas) {
						for (let key in schemaLessStore.subschemas) {
							delete schemaLessStore.subschemas[key].schema;
						}
					}
					return schemaLessStore;
				}
			}
		},
		data () {
			// Determine if entering new record
			const isNew = url.getParam('new') !== null;

			// Create our data object to return
			const data = {
				identifier: null,
				inputID: null,
				isNew,
				schema: sortedSchema,
				watchedFieldsChangeCount: 0,
				watchedFieldsNotified: []
			};

			// If not entering a new record, we need to get the Report ID
			if (!isNew) {
				const id = url.getParam('PK_ID') || url.getParam('pk_id');
				if (id) {
					data.identifier = {
						key: 'ID',
						value: id
					};
				} else {
					console.error('Neither the "new" parameter or a pkid were found');
				}
			}

			return data;
		},
		methods: {
			constructNotificationMessage (name, titles) {
				if (titles.length < 1) {
					console.error('Titles are missing from a schema component that affects other areas.');
					return;
				}
				const before = 'You have changed the ' + name + '. This affects ';
				let middle = '';
				const after = '.  You might want to check ' + (titles.length > 1 ? 'those' : 'that') + ' area' + (titles.length > 1 ? 's' : '') + ' for new options!';

				if (titles.length === 1) {
					middle = '<strong>' + titles[0] + '</strong>';
				} else if (titles.length === 2) {
					middle = '<strong>' + titles[0] + '</strong> and <strong>' + titles[1] + '</strong>';
				} else {
					titles.forEach((title, i) => {
						if (i !== titles.length - 1) {
							middle += '<strong>' + title + '</strong>, ';
						} else {
							middle += 'and <strong>' + title + '</strong>';
						}
					});
				}
				return before + middle + after;
			},
			reloadPage () {
				if (this.inputID !== null) {
					// Send to existing report
					window.location.href = window.location.href + '&pkid=' + this.inputID;
				} else {
					// Send to new report
					window.location.href = window.location.href + '&new';
				}
			}
		},
		mounted () {
			this.watchFields = true;
		},
		store: getStore(schema, !url.getParam('key') || (url.getParam('key') && !url.getParam('value'))),
		watch: {
			fieldsToWatch (newData, oldData) {
				// Only do anything if it's not the change from the initial page load
				if (this.watchedFieldsChangeCount > 0) {
					// Loop through each of the columns
					newData.columns.forEach((column, i) => {
						// If the column's value has changed
						if (column.value !== oldData.columns[i].value) {
							// Get the column from the schema
							const columnFromSchema = schema.columns[schema.columns.map(c => c.columnName).indexOf(column.name)];
							// If the schema specifies the user should always be notified of a
							// change, or if the user hasn't yet been notified about a change
							if (columnFromSchema.affects.showAlways || this.watchedFieldsNotified.indexOf(column.name) === -1) {
								// Construct the notification message
								const message = this.constructNotificationMessage(column.name, columnFromSchema.affects.titles);
								// const message = 'You have changed the ' + column.name + '.  This affects ' + columnFromSchema.affects.titles.join(', ') + ', so you might want to check those for new options!';
								// And notify the user
								notify.log(message);
								// And push the column name into the notified fields array if
								// it's not already there
								if (this.watchedFieldsNotified.indexOf(column.name) === -1) this.watchedFieldsNotified.push(column.name);
							}
						}
					});
					// Loop through each of the associations
					newData.associations.forEach((association, i) => {
						// If the association's records have changed
						if (association.records.length !== oldData.associations[i].records.length) {
							// Get the association from the schema
							const associationFromSchema = schema.associations[schema.associations.map(a => a.title).indexOf(association.title)];
							// If user should always be notified, or if not yet notified
							if (associationFromSchema.affects.showAlways || this.watchedFieldsNotified.indexOf(association.title) === -1) {
								// Construct the notification message
								const message = this.constructNotificationMessage(association.title, associationFromSchema.affects.titles);
								// const message = 'You have changed the ' + association.title + '.  This affects <strong>' + associationFromSchema.affects.titles.join(', ') + '</strong>, so you might want to check those for new options!';
								// And notify the user
								notify.log(message);
								// And push the association name into the notified array if not
								// already there
								if (this.watchedFieldsNotified.indexOf(association.title) === -1) this.watchedFieldsNotified.push(association.title);
							}
						}
					});
				}
				++this.watchedFieldsChangeCount;
			}
		}
	};
</script>

<style lang="scss">
	table tfoot td {
		color: #fff;
		background-color: lighten(#545959, 20%);
		font-weight: 600;
	}
</style>

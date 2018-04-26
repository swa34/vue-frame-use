<template lang="html">
  <div>
		<strong v-if="title || schema.title">
			{{ title || schema.title }}
		</strong>
		<p v-if="description">
			{{ description }}
		</p>
		<div v-for="group in groups">
			<div v-if="!groupsToShow || displayedGroups.indexOf(group.name) !== -1">
				<span v-if="group.name">
					{{ group.name }}
				</span>
				<label v-for="option in group.options">
					<input type="checkbox" :value="generateRecord(option)" v-model="records" :disabled="!allowEdit" />
					<span>
						{{ option[optionLabel || optionID] }}
					</span>
					<span v-if="optionDescription">
						: {{ option[optionDescription] }}
					</span>
				</label>
				<div v-if="allowEdit">
					<button v-on:click="checkAll(group)" class="button">
						Check All
					</button>
					<button v-on:click="uncheckAll(group)" class="button">
						Uncheck All
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import caesdb from '@/modules/caesdb';
	import {
		stringFormats
	} from '@/modules/utilities';

	export default {
		name: 'DataMultiSelect',
		props: {
			'title': {
				type: String
			},
			'description': {
				type: String
			},
			'schema': {
				type: Object,
				required: true
			},
			'allowEdit': {
				type: Boolean
			},
			'identifier': {
				type: Object
			},
			'associatedColumn': {
				type: String,
				required: true
			},
			'groupBy': {
				type: String
			},
			'groupsToShow': {
				type: [
					Array,
					Object
				]
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
			},
			displayedGroups: {
				get () {
					if (Array.isArray(this.groupsToShow)) return this.groupsToShow;
					if (!this.groupsToShow.association || !this.groupsToShow.column) {
						console.error('Groups to show must either be an array or an object containing an association and a column.');
					} else if (!this.$store) {
						console.error('Cannot restrict displayed groups when not using a data store.');
					} else {
						const groupRecords = this.$store.state[stringFormats.camelCase(this.groupsToShow.association)].records;
						const displayedGroups = groupRecords.map(record => record[this.groupsToShow.column]);
						return displayedGroups;
					}
				}
			}
		},
		data () {
			const data = {
				localRecords: [],
				groups: [],
				optionID: null,
				optionLabel: null,
				optionDescription: null
			};
			for (let i = 0; i < this.schema.columns.length; ++i) {
				const column = this.schema.columns[i];
				if (column.columnName === this.associatedColumn && column.constraint) {
					data.optionID = column.constraint.foreignKey;
					data.optionLabel = column.constraint.foreignLabel;
					data.optionDescription = column.constraint.foreignDescription || false;
				}
			}
			return data;
		},
		methods: {
			checkAll (group) {
				group.options.forEach((option) => {
					const record = this.generateRecord(option);
					const recordIndex = this.records.map(e => e[this.associatedColumn]).indexOf(record[this.associatedColumn]);
					if (recordIndex === -1)	this.records.push(record);
				});
			},
			uncheckAll (group) {
				group.options.forEach((option) => {
					const record = this.generateRecord(option);
					const recordIndex = this.records.map(e => e[this.associatedColumn]).indexOf(record[this.associatedColumn]);
					if (recordIndex !== -1) this.records.splice(recordIndex, 1);
				});
			},
			generateRecord (option) {
				const record = {};
				this.schema.columns.forEach((column) => {
					if (column.columnName === this.associatedColumn) {
						record[column.columnName] = option[this.optionID];
					} else {
						record[column.columnName] = this.identifier.value || null;
					}
				});
				return record;
			},
			populateGroups (options, groupBy) {
				const component = this;
				options.forEach((option) => {
					const groupsIndex = component.groups.map(e => e.name).indexOf(option[groupBy]);
					if (groupsIndex === -1) {
						// Group is not present
						component.groups.push({
							name: option[groupBy],
							options: [option]
						});
					} else {
						// Group is present
						if (component.groups[groupsIndex].options.indexOf(option) === -1) {
							// Option is not present
							component.groups[groupsIndex].options.push(option);
						}
					}
				});
			}
		},
		mounted () {
			const component = this;

			const getRecords = () => {
				const options = {
					db: component.schema.database,
					table: component.schema.table,
					identifier: component.identifier
				};
				caesdb.getData(options, (err, data) => {
					if (err) console.error(err);
					if (data.success) {
						// data.results.forEach((result) => {
						// 	component.records.push(result[component.associatedColumn]);
						// });
						component.records = data.results;
					}
				});
			};

			const getOptions = () => {
				component.schema.columns.forEach((column) => {
					if (column.columnName === component.associatedColumn && column.constraint) {
						const options = {
							db: column.constraint.database,
							table: column.constraint.table
						};
						caesdb.getData(options, (err, data) => {
							if (err) console.error(err);
							if (data.success) {
								if (component.groupBy) {
									component.populateGroups(data.results, component.groupBy);
								} else {
									component.groups.push({
										options: data.results
									});
								}
							}
						});
					} else if (column.columnName === component.associatedColumn) {
						console.error('ID Column does not have necessary constraint information.');
					}
				});
			};

			getOptions();
			if (component.identifier.value) getRecords();
		}
	};
</script>

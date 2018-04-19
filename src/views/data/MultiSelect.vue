<template lang="html">
  <div>
		<strong v-if="title || schema.title">
			{{ title || schema.title }}
		</strong>
		<p v-if="description">
			{{ description }}
		</p>
		<div v-for="group in groups">
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
				<button v-on:click="checkAll" class="button">
					Check All
				</button>
				<button v-on:click="uncheckAll" class="button">
					Uncheck All
				</button>
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
			checkAll () {
				this.options.forEach((option) => {
					this.records.push(this.generateRecord(option));
				});
			},
			uncheckAll () {
				this.records = [];
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
					if (component.groups.length === 0) {
						component.groups.push({
							name: option[groupBy],
							options: [option]
						});
					} else {
						for (let i = 0; i < component.groups.length; ++i) {
							if (component.groups[i].name === option[groupBy]) {
								// Group is already present
								if (component.groups[i].options.indexOf(option) === -1) {
									// Option is not present in group
									component.groups[i].options.push(option);
								}
							} else if (i === component.groups.length - 1) {
								// Group is not present
								component.groups.push({
									name: option[groupBy],
									options: [option]
								});
							}
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

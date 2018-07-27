<!-- The HTML portion of the component -->
<template lang="html">
  <main>
		<div v-if="requestsInProgress" class="application-loading-overlay">
			<div class="container">
				<Spinner />
				<p>Loading...</p>
			</div>
		</div>
		<h1>
			{{ schema.title }}
		</h1>
		<section v-for="section in schema.sections">
			<h2 v-on:click="toggleSection(section)" class="section-heading">
				<ChevronDownIcon v-if="sectionShouldBeDisplayed(section)" />
				<ChevronRightIcon v-else />
				{{ section.title }}
			</h2>
			<div v-if="sectionShouldBeDisplayed(section)">
				<div v-if="sectionDependenciesMet(section)">
					<div v-if="section.customComponent">
						<component v-bind:is="section.customComponent" />
					</div>
					<div v-else>
						<div v-for="area in section.areas" class="">
							<div v-if="area.type === 'column' && columnShouldBeDisplayed(area.data)">
								<SmartInput
									v-model="record[area.data.columnName]"
									:field="area.data"
								/>
							</div>
							<div v-else-if="area.type === 'association'">
								<div v-if="area.data.isExternal && identifier.value">
									<!-- Then just show the association title and link to edit it -->
									<h3>
										{{ area.data.title }}
									</h3>
									<p>
										<a :href="area.data.source.url + (area.data.source.hasParams ? '&' : '?') + area.data.source.selector + '=' + identifier.value" class="button">
											Edit
										</a>
									</p>
								</div>
								<!-- If it uses a custom component, render that component -->
								<div v-else-if="area.data.customComponent">
									<component v-if="dependencyMet(area.data)" v-bind:is="area.data.customComponent" />
								</div>
								<!-- If it's a multiselect association, use a data multi select component -->
								<div v-else-if="area.data.multiSelect">
									<DataMultiSelect
										:allowEdit="true"
										:associatedColumn="area.data.associatedColumn"
										:filter="area.data.filter"
										:groupBy="area.data.groupBy"
										:groupLabel="area.data.groupLabel"
										:groupsToShow="area.data.groupsToShow"
										:identifier="generateIdentifier(area.data)"
										:schema="area.data.schema"
										:title="area.data.title"
										:description="area.data.description"
										:affects="area.data.affects"
									/>
								</div>
								<!-- If multiple values are forbidden, use a data radio component -->
								<div v-else-if="area.data.forbidMultiple">
									<DataRadio
										:title="area.data.title"
										:schema="area.data.schema"
										:allowEdit="true"
										:associatedColumn="area.data.associatedColumn"
										:identifier="generateIdentifier(area.data)"
										:filter="area.data.filter"
										:description="area.data.description"
										:affects="area.data.affects"
									/>
								</div>
								<div v-else-if="area.data.displayAllOptions">
									<DataMultiTable
										v-if="dependencyMet(area.data)"
										:title="area.data.title"
										:schema="area.data.schema"
										:associatedColumn="area.data.associatedColumn"
										:identifier="generateIdentifier(area.data)"
										:allowEdit="true"
										:optionColumnName="area.data.optionColumnName"
										:filter="area.data.filter"
										:showTotals="area.data.showTotals"
										:depends="area.data.depends"
									/>
								</div>
								<!-- Else, just use a data table component -->
								<div v-else-if="!identifier.value ? area.data.isAssignable : true">
									<DataTable
										:title="area.data.title"
										:schema="area.data.schema"
										:associatedColumn="area.data.foreignKey"
										:identifier="generateIdentifier(area.data)"
										:allowInsert="true"
										:allowEdit="true"
									/>
								</div>
							</div>
							<div v-else-if="area.type === 'subschema'">
								<component v-bind:is="area.data.customComponent" />
							</div>
						</div>
					</div>
				</div>
				<div v-else>
					<p>
						In order to enter {{ section.title }}, you must first make a selection for <span v-html="getSectionDependsMessage(section)"></span>.
					</p>
				</div>
			</div>
		</section>
		<!-- We use a data form component to display the main record -->
		<!-- <DataForm
			:schema="schema"
			:identifier="identifier"
		/>
		<div v-if="includeSubSchemas">
			<div v-for="subschema in schema.subschemas" v-bind:key="subschema.title">
				<component v-bind:is="subschema.customComponent" />
			</div>
		</div> -->
		<button v-if="!identifier.value" v-on:click="submitData" type="button" class="button">
			Submit
		</button>
  </main>
</template>

<!-- The script portion of the component -->
<script>
	/* global activeUserID */
	/* global swal */
	// Import required modules
	import DetailMain from '@/views/DetailMain';
	import SmartInput from '@/views/elements/SmartInput';
	import Spinner from 'vue-simple-spinner';
	import {
		DataForm,
		DataMultiSelect,
		DataMultiTable,
		DataRadio,
		DataTable
	} from '@/views/data';
	import {
		formatDates,
		sqlToHtml,
		stringFormats
	} from '@/modules/utilities';
	import {
		getCriteriaStructure
	} from '@/modules/caesdb';
	import {
		cfToJs,
		jsToCf
	} from '@/modules/criteriaUtils';
	import {
		ChevronDownIcon,
		ChevronRightIcon
	} from 'vue-feather-icons';

	// Export the actual component
	export default {
		// The component's name
		name: 'DetailMain',
		// The nested components available to this component
		components: {
			ChevronDownIcon,
			ChevronRightIcon,
			DataForm,
			DataMultiSelect,
			DataMultiTable,
			DataRadio,
			DataTable,
			DetailMain,
			SmartInput,
			Spinner
		},
		computed: {
			columns: {
				get () {
					let columns = [];
					this.schema.sections.forEach((section) => {
						section.areas.forEach((area) => {
							if (area.type === 'column') columns.push(area.data);
						});
					});
					return columns;
				}
			},
			dateFields () {
				let dateFields = [];
				this.columns.forEach((column) => {
					if (sqlToHtml(column) === 'date') dateFields.push(column.columnName);
				});
				return dateFields;
			},
			duplication () {
				return this.$store.state.duplication;
			},
			record: {
				get () {
					return this.$store.state[stringFormats.camelCase(this.schema.title)];
				},
				set (val) {
					this.$store.state[stringFormats.camelCase(this.schema.title)] = val;
				}
			}
		},
		data () {
			let sectionsToDisplay = [];
			if (this.identifier.value && !this.identifier.duplicate) {
				sectionsToDisplay.push(this.schema.sections[0].title);
				sectionsToDisplay.push(this.schema.sections[1].title);
				// sectionsToDisplay = this.schema.sections.map(s => s.title);
			} else if (this.schema.sections.length > 0) {
				sectionsToDisplay.push(this.schema.sections[0].title);
			}
			return {
				requestsInProgress: typeof window.pendingRequests !== 'undefined' && window.pendingRequests !== 0,
				sectionsToDisplay
			};
		},
		// The methods available to this component during render
		methods: {
			// Doesn't send anything yet, just pretends like it does
			submitData () {
				swal('Awesome!', 'Your entry has been saved successfully.', 'success');
				console.log('Successfully sent this data to the server:');
				const schemaLessStore = Object.assign({}, this.$store.state);
				delete schemaLessStore.schema;
				console.log(JSON.stringify(schemaLessStore, null, 2));
			},
			columnShouldBeDisplayed (column) {
				if (!column.depends) {
					if (column.automated) return false;
					return true;
				} else {
					return column.depends.test(this.record[column.depends.column]);
				}
			},
			// A function to determine if an association's dependency has been met
			dependencyMet (association) {
				// If there is no dependency, it obviously has
				if (!association.depends) return true;
				// Otherwise, we need to make sure the association dependency specifies
				// which column or association it depends on
				if (association.depends.column) {
					// If it depends on a column, run the depend's test function on that
					// columns value
					return association.depends.test(this.$store.state[stringFormats.camelCase(this.schema.title || this.schema.table)][association.depends.column]);
				} else if (association.depends.association) {
					// If it's an association, run the test function on that association's
					// records.
					if (association.depends.useValues) {
						return association.depends.test(this.$store.state[stringFormats.camelCase(association.depends.association)].records, this.$store.state.schema);
					} else {
						return association.depends.test(this.$store.state[stringFormats.camelCase(association.depends.association)].records);
					}
				}
				// If no column or association were specified, we're in an error state
				// so say so and consider the dependency unmet.
				console.error('Dependency information missing for association: ' + association.title);
				return false;
			},
			generateIdentifier (association) {
				return {
					key: association.foreignKey,
					value: this.identifier.value,
					criteriaString: association.criteriaString || 'criteria_' + association.foreignKey + '_eq',
					duplicate: this.identifier.duplicate || false
				};
			},
			getMainData () {
				getCriteriaStructure(this.schema.tablePrefix, (err, data) => {
					if (err) console.error(err);
					if (data.Message) {
						console.error(new Error(data.Message));
					} else {
						let critStruct = cfToJs(data);
						critStruct[this.schema.criteria.string] = this.identifier.value;
						this.schema.fetchExisting(jsToCf(critStruct), (err, data) => {
							if (err) console.error(err);
							if (data.Message) {
								console.error(new Error(data.Message));
							} else {
								let existingRecord = data[0];
								for (let key in this.record) {
									if ((this.identifier.duplicate && this.duplication.columns[key]) || !this.identifier.duplicate) {
										if (existingRecord.hasOwnProperty(key)) {
											this.record[key] = existingRecord[key];
										} else {
											console.warn('Local record has key "' + key + '" but remote record does not.');
										}
									}
								}
								if (this.dateFields.length > 0) formatDates(this.dateFields, this.record);
							}
						});
					}
				});
			},
			getSectionDependsMessage (section) {
				let message = '';
				let totalDependencies = 0;
				let listedDependencies = 0;
				if (section.depends.columns) totalDependencies += section.depends.columns.length;
				if (section.depends.associations) totalDependencies += section.depends.associations.length;
				if (section.depends.columns) {
					section.depends.columns.forEach((column) => {
						++listedDependencies;
						if (listedDependencies < totalDependencies) {
							message += 'a <strong>' + column + '</strong>, ';
						} else {
							message += 'and a <strong>' + column + '</strong>';
						}
					});
				}
				if (section.depends.associations) {
					section.depends.associations.forEach((association) => {
						++listedDependencies;
						if (listedDependencies < totalDependencies) {
							message += '<strong>' + association + '</strong>, ';
						} else {
							message += 'and <strong>' + association + '</strong>';
						}
					});
				}
				return message;
			},
			sectionDependenciesMet (section) {
				if (!section.depends) return true;
				let dependenciesMet = true;
				if (section.depends.columns) {
					section.depends.columns.forEach((column) => {
						if (!this.record[column]) dependenciesMet = false;
					});
				}
				if (section.depends.associations) {
					section.depends.associations.forEach((association) => {
						let camelTitle = stringFormats.camelCase(association);
						if (this.$store.state[camelTitle].records.length < 1) dependenciesMet = false;
					});
				}
				return dependenciesMet;
			},
			sectionShouldBeDisplayed (section) {
				return this.sectionsToDisplay.indexOf(section.title) !== -1;
			},
			toggleSection (section) {
				const index = this.sectionsToDisplay.indexOf(section.title);
				if (index === -1) {
					this.sectionsToDisplay.push(section.title);
				} else {
					this.sectionsToDisplay.splice(index, 1);
				}
			}
		},
		mounted () {
			// Set up the watcher for pending requests
			setInterval(() => {
				if (this.requestsInProgress !== (typeof window.pendingRequests !== 'undefined' && window.pendingRequests !== 0)) {
					this.requestsInProgress = typeof window.pendingRequests !== 'undefined' && window.pendingRequests !== 0;
				}
			}, 300);

			const getConstraintData = () => {
				this.columns.forEach((column) => {
					// We only care about columns that have a constraint and a getValues
					// function, since those are the ones we have to fetch values for
					if (column.constraint && column.constraint.getValues) {
						if (column.constraint.tablePrefix) {
							// If the constraint has a tablePrefix, we need to get a criteria
							// structure first, then send our request
							getCriteriaStructure(column.constraint.tablePrefix, (err, criteriaStructure) => {
								if (err) console.error(err);
								criteriaStructure[column.constraint.criteria.string] = column.constraint.criteria.useUserID ? activeUserID : column.constraint.criteria.value;
								column.constraint.getValues(criteriaStructure, (err, data) => {
									if (err) console.error(err);
									if (data) column.constraint.values = data;
								});
							});
						} else {
							// If no table prefix, just fetch the data
							column.constraint.getValues((err, data) => {
								if (err) console.error(err);
								if (data) column.constraint.values = data;
							});
						}
					}
				});
			};

			if (this.identifier) this.getMainData();
			getConstraintData();
		},
		// The component's properties, which are set by the parent component.
		props: {
			// The schema to be used
			'schema': {
				type: Object,
				required: true
			},
			// An optional identifier/selector
			'identifier': {
				type: [
					Object,
					Boolean
				]
			},
			// Should associations be rendered too?
			'includeAssociations': {
				type: Boolean,
				default: true
			},
			// How about subschemas?
			'includeSubSchemas': {
				type: Boolean,
				default: true
			}
		},
		watch: {
			duplication: {
				handler () {
					this.getMainData();
				},
				deep: true
			}
		}
	};
</script>

<style lang="scss">
	div.application-loading-overlay {
		background: rgba(255,255,255,.65);
		position: fixed;
		z-index: 10;
		top: 0;
		right: 0;
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		div.container {
			background: #fff;
			text-align: center;
			border-radius: .375rem;
			padding: 2rem 3rem 1rem;
			box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
		}
	}
	h2.section-heading {
		cursor: pointer;
		svg {
			vertical-align: middle;
		}
	}
	section {
		border-bottom: 1px solid #000;
		&:last-of-type {
			border-bottom: none;
		}
	}
	.fade-enter-active, .fade-leave-active {
		transition: opacity .5s;
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}
	li.list-complete-item {
		transition: all .5s;
		display: list-item;
	}
	li.list-complete-enter, .list-complete-leave-to {
		opacity: 0;
		transform: translateX(-1.5rem);
	}
	li.list-complete-leave-active {
		position: absolute;
	}
</style>

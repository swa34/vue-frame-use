<!-- The HTML portion of the component -->
<template lang="html">
  <div>
		<ContextualHelpMessage
			:messageName="helpMessage.name"
			v-on:close-modal="hideHelp"
			v-if="helpMessage.show"
		/>
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
			<h2 v-on:click="toggleSection(section)" class="head section-heading">
				<ChevronDownIcon v-if="sectionShouldBeDisplayed(section)" />
				<ChevronRightIcon v-else />
				{{ section.title }}
			</h2>
			<div v-if="sectionShouldBeDisplayed(section)">
				<div v-if="sectionDependenciesMet(section)">
					<div v-if="section.customComponent">
						<component
							v-bind:is="section.customComponent"
							v-on:show-help="showHelp"
							:mode="mode"
						/>
					</div>
					<div v-else>
						<div v-for="area in section.areas">
							<transition appear name="fade">
								<div v-if="area.type === 'column' && columnShouldBeDisplayed(area.data)">
									<SmartInput
										v-if="mode === 'edit'"
										v-model="record[area.data.columnName]"
										:field="area.data"
										v-on:show-help="showHelp(area.data)"
									/>
									<div v-else>
										<h3 class="inline">
											{{ area.data.prettyName || getPrettyColumnName(area.data.columnName) }}:
										</h3>
										<span v-if="area.data.inputType === 'select' || sqlToHtml(area.data) === 'select'">
											{{ area.data.constraint.values[area.data.constraint.values.map(v => v[area.data.constraint.foreignKey]).indexOf(record[area.data.columnName])][area.data.constraint.foreignLabel] }}
										</span>
										<span v-else>
											{{ record[area.data.columnName] }}
										</span>
									</div>
								</div>
								<div v-else-if="area.type === 'association'">
									<div v-if="area.data.isExternal && identifier.value && dependencyMet(area.data)">
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
										<component
											v-if="dependencyMet(area.data)"
											v-bind:is="area.data.customComponent"
											v-on:show-help="showHelp"
											:mode="getMode(area.data)"
										/>
									</div>
									<!-- If it's a multiselect association, use a data multi select component -->
									<div v-else-if="area.data.multiSelect">
										<DataMultiSelect
											v-if="dependencyMet(area.data)"
											v-on:show-help="showHelp(area.data)"
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
											:helpMessageName="area.data.helpMessageName"
											:mode="getMode(area.data)"
										/>
									</div>
									<!-- If multiple values are forbidden, use a data radio component -->
									<div v-else-if="area.data.forbidMultiple">
										<DataRadio
											v-if="dependencyMet(area.data)"
											v-on:show-help="showHelp(area.data)"
											:title="area.data.title"
											:schema="area.data.schema"
											:associatedColumn="area.data.associatedColumn"
											:identifier="generateIdentifier(area.data)"
											:filter="area.data.filter"
											:description="area.data.description"
											:affects="area.data.affects"
											:helpMessageName="area.data.helpMessageName"
											:mode="getMode(area.data)"
										/>
									</div>
									<div v-else-if="area.data.displayAllOptions">
										<DataMultiTable
											v-if="dependencyMet(area.data)"
											v-on:show-help="showHelp(area.data)"
											:title="area.data.title"
											:schema="area.data.schema"
											:associatedColumn="area.data.associatedColumn"
											:identifier="generateIdentifier(area.data)"
											:optionColumnName="area.data.optionColumnName"
											:filter="area.data.filter"
											:showTotals="area.data.showTotals"
											:depends="area.data.depends"
											:description="area.data.description"
											:helpMessageName="area.data.helpMessageName"
											:mode="getMode(area.data)"
										/>
									</div>
									<!-- Else, just use a data table component -->
									<div v-else-if="!identifier.value ? area.data.isAssignable : true">
										<DataTable
											v-if="dependencyMet(area.data)"
											v-on:show-help="showHelp(area.data)"
											:title="area.data.title"
											:schema="area.data.schema"
											:associatedColumn="area.data.foreignKey"
											:identifier="generateIdentifier(area.data)"
											:allowInsert="true"
											:allowEdit="true"
											:description="area.data.description"
											:helpMessageName="area.data.helpMessageName"
											:mode="getMode(area.data)"
										/>
									</div>
								</div>
								<div v-else-if="area.type === 'subschema'">
									<component
										v-bind:is="area.data.customComponent"
										v-on:show-help="showHelp"
										:mode="getMode(area.data)"
									/>
								</div>
							</transition>
						</div>
					</div>
				</div>
				<div v-else>
					<p v-if="mode === 'edit'">
						In order to enter {{ section.title }}, you must first make a selection for <span v-html="getSectionDependsMessage(section)"></span>.
					</p>
					<p v-else>
						In order to see {{ section.title }}, please expand the <span v-html="getSectionDependsMessage(section)"></span> section(s).
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
		<button v-if="mode === 'edit'" v-on:click="cleanUpData" type="button" class="button">
			Submit
		</button>
  </div>
</template>

<!-- The script portion of the component -->
<script>
	/* global activeUserID */
	/* global notify */
	/* global swal */
	// Import required modules
	import DetailMain from '@/views/DetailMain';
	import ContextualHelpMessage from '@/views/ContextualHelpMessage';
	import SmartInput from '@/views/elements/SmartInput';
	import Spinner from 'vue-simple-spinner';
	import prepareForCf from '@/modules/prepareForCf';
	import {
		DataForm,
		DataMultiSelect,
		DataMultiTable,
		DataRadio,
		DataTable
	} from '@/views/data';
	import {
		deepObjectAssign,
		formatDates,
		getPrettyColumnName,
		sqlToHtml,
		stringFormats
	} from '@/modules/utilities';
	import { getCriteriaStructure } from '@/modules/caesdb';
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
			ContextualHelpMessage,
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
				this.schema.sections.forEach((section) => {
					sectionsToDisplay.push(section.title);
				});
			} else if (this.schema.sections.length > 0) {
				sectionsToDisplay.push(this.schema.sections[0].title);
			}
			return {
				helpMessage: {
					show: false,
					name: ''
				},
				requestsInProgress: typeof window.pendingRequests !== 'undefined' && window.pendingRequests !== 0,
				sectionsToDisplay
			};
		},
		// The methods available to this component during render
		methods: {
			getPrettyColumnName,
			showHelp (area) {
				if (area.helpMessageName) {
					this.helpMessage.name = area.helpMessageName;
					this.helpMessage.show = true;
				}
			},
			hideHelp () {
				this.helpMessage.show = false;
				this.helpMessage.name = '';
			},
			// Clean up any extra data that no longer applies based on current
			// selections/entries
			cleanUpData () {
				const schemaLessStore = deepObjectAssign({}, this.$store.state);
				delete schemaLessStore.schema;
				const cleanedUpStore = this.schema.cleanUpData(schemaLessStore);
				this.schema.sections.forEach((section) => {
					section.areas.forEach((area) => {
						const areaCamelTitle = stringFormats.camelCase(area.data.title);
						if (area.type === 'association' && area.data.schema && area.data.schema.prepareForSubmit) {
							const records = schemaLessStore[areaCamelTitle].records;
							schemaLessStore[areaCamelTitle].records = area.data.schema.prepareForSubmit(records);
						}
						if (area.type === 'subschema') {
							if (area.data.schema.prepareForSubmit) {
								schemaLessStore.subschemas[areaCamelTitle][areaCamelTitle] = area.data.schema.prepareForSubmit(schemaLessStore.subschemas[areaCamelTitle][areaCamelTitle]);
							}
							area.data.schema.associations.forEach((subArea) => {
								if (subArea.schema && subArea.schema.prepareForSubmit) {
									const subAreaCamelTitle = stringFormats.camelCase(subArea.title);
									const records = schemaLessStore.subschemas[areaCamelTitle][subAreaCamelTitle].records;
									schemaLessStore.subschemas[areaCamelTitle][subAreaCamelTitle].records = subArea.schema.prepareForSubmit(records);
								}
							});
						}
					});
				});
				this.validateData(cleanedUpStore);
			},
			// Run validation on the data
			validateData (store) {
				// console.log(store);
				let isValid = true;
				// this.schema.sections.forEach((section) => {
				// 	section.areas.forEach((area) => {
				// 		if (area.data.validate) {
				// 			const validation = area.data.validate(store);
				// 			if (validation.isValid !== true) {
				// 				notify.error(validation.message);
				// 				isValid = false;
				// 			};
				// 		}
				// 	});
				// });
				if (isValid) this.submitData(store);
			},
			// Doesn't send anything yet, just pretends like it does
			submitData (store) {
				notify.clear();
				// for (let key in store.report) {
				// 	if (store.report[key] === null) store.report[key] = '';
				// }
				// store.subschemas.subReport.supplementalData.records.forEach((record) => {
				// 	// Convert booleans to 1s and 0s
				// 	console.log(record);
				// 	console.log(typeof record.FIELD_VALUE);
				// 	console.log(record.FIELD_VALUE);
				// 	if (typeof record.FIELD_VALUE === 'boolean') record.FIELD_VALUE = record.FIELD_VALUE ? 1 : 0;
				// });
				store = prepareForCf(store);
				this.schema.processSubmission(store, (err, data) => {
					if (err) notify.error(err);
					if (data) {
						if (data.SUCCESS) {
							swal('Awesome!', 'Your entry has been saved successfully.', 'success')
								.then((result) => {
									window.location = 'https://devssl.caes.uga.edu/gacounts3/index.cfm?referenceInterface=REPORT&subInterface=detail_main&PK_ID=' + data.REPORT_ID;
								});
						} else {
							notify.error(data.MESSAGES);
						}
					}
				});
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
			getMode (area) {
				if (area.disallowEditOfExisting) {
					if (!this.identifier) return this.mode;
					return 'view';
				} else {
					return this.mode;
				}
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
			sqlToHtml,
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
			// Display mode
			'mode': {
				type: String,
				required: true,
				default: 'view',
				validator (value) {
					return ['edit', 'view'].indexOf(value) !== -1;
				}
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

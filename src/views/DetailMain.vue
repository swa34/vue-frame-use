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
		<section v-for="section in schema.sections">
			<h2 v-on:click="toggleSection(section)" class="head section-heading">
				<ChevronDownIcon v-if="sectionShouldBeDisplayed(section)" />
				<ChevronRightIcon v-else />
				{{ section.title }}
				<em v-if="section.required" class="required-label">
					(Required)
				</em>
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
										<span v-if="(area.data.inputType === 'select' || sqlToHtml(area.data) === 'select')">
											{{ getOptionLabel(area.data.constraint, record[area.data.columnName]) }}
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
											v-on:expand-section="expandSection"
											v-on:collapse-section="collapseSection"
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
											:recordLimit="area.data.limit"
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
		<div v-if="mode === 'edit'" class="submit">
			<hr />
			<p>
				<strong>
					Finished?
				</strong>
				<span>
					Click the button below to submit your {{ isNew ? schema.title : 'changes' }}.
				</span>
				<span v-if="!isNew">
					If you would like to, you may also <a id="delete-link" v-on:click="deleteRecord" >delete your {{ schema.title }}</a>.
				</span>
				<br />
				<button v-on:click="cleanUpData" type="button" class="button">
					Save My {{ schema.title }}
				</button>
			</p>
		</div>
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
	import ChevronDownIcon from 'vue-feather-icons/icons/ChevronDownIcon';
	import ChevronRightIcon from 'vue-feather-icons/icons/ChevronRightIcon';
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
	import {
		getCriteriaStructure,
		logError
	} from '@/modules/caesdb';

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
			isNew () { return this.identifier === null || this.identifier === false || this.identifier.duplicate; },
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
			// let sectionsToDisplay = [];
			// if (this.identifier.value) {
			// 	this.schema.sections.forEach((section) => {
			// 		sectionsToDisplay.push(section.title);
			// 	});
			// } else if (this.schema.sections.length > 0) {
			// 	sectionsToDisplay.push(this.schema.sections[0].title);
			// }
			return {
				helpMessage: {
					show: false,
					name: ''
				},
				requestsInProgress: typeof window.pendingRequests !== 'undefined' && window.pendingRequests !== 0,
				sectionsToDisplay: this.schema.sections.map(s => s.title)
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
			deleteRecord () {
				swal({
					title: 'Are you sure?',
					text: "You won't be able to undo this!",
					type: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Yes, delete it!'
				}).then((result) => {
					if (result.value) {
						this.schema.deleteExisting(this.identifier.value, (err, data) => {
							if (err) logError(err);
							if (data.SUCCESS) {
								swal(
									'Deleted!',
									'Your ' + this.schema.title + ' has been deleted.',
									'success'
								).then(() => {
									window.location.assign('https://' + window.location.hostname + '/gacounts3');
								});
							} else {
								swal(
									'Oops!',
									'Something went wrong on our end and your ' + this.schema.title + ' could not be deleted.',
									'error'
								);
							}
						});
					}
				});
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
				store = prepareForCf(store);
				this.schema.processSubmission(store, (err, data) => {
					if (err) notify.error(err);
					if (data) {
						if (data.SUCCESS) {
							if (this.isNew) {
								swal({
									type: 'success',
									title: 'Awesome!',
									text: 'Your ' + this.schema.title.toLowerCase() + ' has been saved successfully.',
									showCancelButton: true,
									confirmButtonText: 'OK',
									cancelButtonText: 'Duplicate this ' + this.schema.title.toLowerCase()
								}).then((result) => {
									console.log(result);
									if (result.value) {
										// They clicked OK
										window.location.assign('https://' + window.location.hostname + '/gacounts3/index.cfm?referenceInterface=REPORT&subInterface=detail_main&PK_ID=' + data.REPORT_ID);
									} else if (result.dismiss === swal.DismissReason.cancel) {
										// They clicked duplicate
										window.location.assign(window.location + '&duplicateID=' + data.REPORT_ID);
									}
								});
							} else {
								swal('Awesome!', 'Your changes have been saved successfully.', 'success')
									.then((result) => {
										window.location.assign('https://' + window.location.hostname + '/gacounts3/index.cfm?referenceInterface=REPORT&subInterface=detail_main&PK_ID=' + data.REPORT_ID);
									});
							}
						} else {
							swal({
								type: 'error',
								title: 'Oops!',
								html: '<p>Your ' + (this.isNew ? this.schema.title.toLowerCase() + ' was' : 'changes were') + ' unable to be saved due to the following issues:</p><div style="text-align: left;">' + data.MESSAGES + '</div>'
							});
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
				logError(new Error(`Dependency information missing for association: ${association.title}`));
				return false;
			},
			generateIdentifier (association) {
				return {
					key: association.foreignKey,
					value: this.identifier.value,
					criteriaString: association.criteriaString || `criteria_${association.foreignKey}_eq`,
					duplicate: this.identifier.duplicate || false
				};
			},
			getMainData () {
				getCriteriaStructure(this.schema.tablePrefix, (err, data) => {
					if (err) logError(err);
					if (data) {
						let critStruct = data;
						critStruct[this.schema.criteria.string] = this.identifier.value;
						this.schema.fetchExisting(critStruct, (err, data) => {
							if (err) logError(err);
							if (data && data.length > 0) {
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
					if (this.isNew) return this.mode;
					return 'view';
				} else {
					return this.mode;
				}
			},
			getOptionLabel (constraint, value) {
				if (constraint.values.length < 1) return '';
				const constraintValuesMap = constraint.values.map(v => v[constraint.foreignKey]);
				const index = constraintValuesMap.indexOf(value);
				const option = constraint.values[index];
				if (!option) return '';
				const label = option[constraint.foreignLabel];
				return label;
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
			expandSection (sectionTitle) { if (this.sectionsToDisplay.indexOf(sectionTitle) === -1) this.sectionsToDisplay.push(sectionTitle); },
			collapseSection (sectionTitle) {
				const index = this.sectionsToDisplay.indexOf(sectionTitle);
				if (index !== -1) this.sectionsToDisplay.splice(index, 1);
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
								if (err) logError(err);
								criteriaStructure[column.constraint.criteria.string] = column.constraint.criteria.useUserID ? activeUserID : column.constraint.criteria.value;
								column.constraint.getValues(criteriaStructure, (err, data) => {
									if (err) logError(err);
									if (data) column.constraint.values = data;
								});
							});
						} else {
							// If no table prefix, just fetch the data
							column.constraint.getValues((err, data) => {
								if (err) logError(err);
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
			},
			'userIsOwner': {
				type: Boolean,
				default: false
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
	div.submit {
		hr {
			margin-top: 2rem;
		}
		p {
			text-align: center;
			button {
				// background: cornflowerblue;
				max-width: 100%;
				width: 32rem;
				font-size: 1.25rem;
				// text-transform: uppercase;
				// &:hover {
				// 	background: darken(cornflowerblue, 20%);
				// }
			}
			a#delete-link { cursor: pointer; }
		}
	}
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
		user-select: none;
		svg {
			vertical-align: middle;
		}
		em.required-label {
			font-size: .75rem;
			line-height: 1.6rem;
			margin-left: .5rem;
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

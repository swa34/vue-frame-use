<!-- The HTML portion of the component -->
<template lang="html">
  <main>
		<h3>
			{{ schema.title || schema.table }}
		</h3>
		<!-- We use a data form component to display the main record -->
		<DataForm
			:schema="schema"
			:identifier="identifier"
		/>
		<!-- Then, if we want to include associations -->
		<div v-if="includeAssociations">
			<!-- We loop through each of them -->
			<div v-for="association in schema.associations" v-bind:key="association.title">
				<!-- <div v-if="dependencyMet(association)"> -->
					<!-- If it's an external association (not Vue-based) -->
					<div v-if="association.isExternal && identifier.value">
						<!-- Then just show the association title and link to edit it -->
						<span>
							{{ association.title }}
						</span>
						<p>
							<a :href="association.source.url + (association.source.hasParams ? '&' : '?') + association.source.selector + '=' + identifier.value" class="button">
								Edit
							</a>
						</p>
					</div>
					<!-- If it uses a custom component, render that component -->
					<div v-else-if="association.customComponent">
						<component v-bind:is="association.customComponent" />
					</div>
					<!-- If it's a multiselect association, use a data multi select component -->
					<div v-else-if="association.multiSelect">
						<DataMultiSelect
							:allowEdit="true"
							:associatedColumn="association.associatedColumn"
							:filter="association.filter"
							:groupBy="association.groupBy"
							:groupLabel="association.groupLabel"
							:groupsToShow="association.groupsToShow"
							:identifier="{ key: association.foreignKey, value: identifier.value }"
							:schema="association.schema"
							:title="association.title"
							:description="association.description"
						/>
					</div>
					<!-- If multiple values are forbidden, use a data radio component -->
					<div v-else-if="association.forbidMultiple">
						<DataRadio
							:title="association.title"
							:schema="association.schema"
							:allowEdit="true"
							:associatedColumn="association.associatedColumn"
							:identifier="{ key: association.foreignKey, value: identifier.value }"
							:filter="association.filter"
							:description="association.description"
						/>
					</div>
					<div v-else-if="association.displayAllOptions">
						<DataMultiTable
							v-if="dependencyMet(association)"
							:title="association.title"
							:schema="association.schema"
							:associatedColumn="association.associatedColumn"
							:identifier="{ key: association.foreignKey, value: identifier.value}"
							:allowEdit="true"
							:optionColumnName="association.optionColumnName"
							:filter="association.filter"
							:showTotals="association.showTotals"
							:depends="association.depends"
						/>
					</div>
					<!-- Else, just use a data table component -->
					<div v-else-if="!identifier.value ? association.isAssignable : true">
						<DataTable
							:title="association.title"
							:schema="association.schema"
							:associatedColumn="association.foreignKey"
							:identifier="{
								key: association.foreignKey,
								value: identifier.value,
								criteriaString: association.criteriaString
							}"
							:allowInsert="true"
							:allowEdit="true"
						/>
					</div>
					<hr />
				<!-- </div> -->
			</div>
		</div>
		<div v-if="includeSubSchemas">
			<div v-for="subschema in schema.subschemas" v-bind:key="subschema.title">
				<!-- Right now, only supporting custom components.  Later, DetailMain
				and everything else under it will be made to support recursive usage.
				The issue is the Vuex data store... -->
				<component v-bind:is="subschema.customComponent" />
			</div>
		</div>
		<button v-if="!identifier.value" v-on:click="submitData" type="button" class="button">
			Submit
		</button>
  </main>
</template>

<!-- The script portion of the component -->
<script>
	/* global swal */
	// Import required modules
	import DetailMain from '@/views/DetailMain';
	import {
		DataForm,
		DataMultiSelect,
		DataMultiTable,
		DataRadio,
		DataTable
	} from '@/views/data';
	import { stringFormats } from '@/modules/utilities';

	// Export the actual component
	export default {
		// The component's name
		name: 'DetailMain',
		// The nested components available to this component
		components: {
			DataForm,
			DataMultiSelect,
			DataMultiTable,
			DataRadio,
			DataTable,
			DetailMain
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
			}
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
		}
	};
</script>

<style lang="scss">
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

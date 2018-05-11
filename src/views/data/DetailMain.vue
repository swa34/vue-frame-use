<!-- The HTML portion of the component -->
<template lang="html">
  <main>
  	<h1>
  		{{ schema.title || schema.table }} Detail
  	</h1>
		<!-- We use a data form component to display the main record -->
		<DataForm
			:schema="schema"
			:identifier="identifier"
		/>
		<!-- Then, if we want to include associations -->
		<div v-if="includeAssociations">
			<!-- We loop through each of them -->
			<div v-for="association in schema.associations">
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
					<!-- If it's a multiselect association, use a data multi select component -->
					<div v-else-if="association.multiSelect">
						<DataMultiSelect
							:allowEdit="true"
							:associatedColumn="association.associatedColumn"
							:filter="association.filter"
							:groupBy="association.groupBy"
							:groupsToShow="association.groupsToShow"
							:identifier="{ key: association.foreignKey, value: identifier.value }"
							:schema="association.schema"
							:title="association.title"
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
						/>
					</div>
					<!-- Else, just use a data table component -->
					<div v-else-if="!identifier.value ? association.isAssignable : true">
						<DataTable
							:title="association.title"
							:schema="association.schema"
							:associatedColumn="association.foreignKey"
							:identifier="{ key: association.foreignKey, value: identifier.value}"
							:allowInsert="true"
							:allowEdit="true"
						/>
					</div>
					<hr />
				<!-- </div> -->
			</div>
		</div>
		<button v-if="!identifier.value" v-on:click="submitData" class="button">
			Submit
		</button>
  </main>
</template>

<!-- The script portion of the component -->
<script>
	// Import required modules
	import caesdb from '@/modules/caesdb';
	import {
		DataForm,
		DataMultiSelect,
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
			DataRadio,
			DataTable
		},
		// The methods available to this component during render
		methods: {
			// Doesn't send anything yet, just pretends like it does
			submitData () {
				caesdb.post(this.$store.state, (err, data) => {
					if (err) console.error(err);
					if (data.success) {
						this.$swal('Awesome!', 'Your entry has been saved successfully.', 'success');
						console.log('Successfully sent this data to the server:');
						console.log(JSON.stringify(this.$store.state, null, 2));
					}
				});
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
					return association.depends.test(this.$store.state[stringFormats.camelCase(association.title)].records);
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
			}
		}
	};
</script>

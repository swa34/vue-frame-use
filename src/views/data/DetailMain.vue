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
		<!-- And data table components to display the main record's associated data -->
		<div v-if="includeAssociations">
			<div v-for="association in schema.associations">
				<!-- <div v-if="dependencyMet(association)"> -->
					<div v-if="association.isExternal && identifier.value">
						<span>
							{{ association.title }}
						</span>
						<p>
							<a :href="association.source.url + (association.source.hasParams ? '&' : '?') + association.source.selector + '=' + identifier.value" class="button">
								Edit
							</a>
						</p>
					</div>
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

<script>
	// Import required modules
	import { stringFormats } from '@/modules/utilities';
	import DataForm from '@/views/data/Form';
	import DataMultiSelect from '@/views/data/MultiSelect';
	import DataRadio from '@/views/data/Radio';
	import DataTable from '@/views/data/Table';
	import caesdb from '@/modules/caesdb';

	// Export the actual component
	export default {
		name: 'DetailMain',
		components: {
			DataForm,
			DataMultiSelect,
			DataRadio,
			DataTable
		},
		methods: {
			submitData () {
				// Doesn't send anything yet, just pretends like it does
				caesdb.post(this.$store.state, (err, data) => {
					if (err) console.error(err);
					if (data.success) {
						this.$swal('Awesome!', 'Your entry has been saved successfully.', 'success');
						console.log('Successfully sent this data to the server:');
						console.log(JSON.stringify(this.$store.state, null, 2));
					}
				});
			},
			dependencyMet (association) {
				if (!association.depends) return true;
				if (association.depends.column) {
					return association.depends.test(this.$store.state[stringFormats.camelCase(this.schema.title || this.schema.table)][association.depends.column]);
				} else if (association.depends.association) {
					return association.depends.test(this.$store.state[stringFormats.camelCase(association.title)].records);
				}
				console.error('Dependency information missing for association: ' + association.title);
				return false;
			}
		},
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
			},
			'includeAssociations': {
				type: Boolean,
				default: true
			}
		}
	};
</script>

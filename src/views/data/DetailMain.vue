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
				<div v-if="association.multiSelect">
					<DataMultiSelect
						:title="association.title"
						:schema="association.schema"
						:allowEdit="true"
						:associatedColumn="association.associatedColumn"
						:identifier="{ key: association.foreignKey, value: identifier.value}"
					/>
				</div>
				<div v-else>
					<DataTable
						v-if="!identifier.value ? association.isAssignable : true"
						:title="association.title"
						:schema="association.schema"
						:associatedColumn="association.foreignKey"
						:identifier="{ key: association.foreignKey, value: identifier.value}"
						:allowInsert="true"
						:allowEdit="true"
					/>
				</div>
			</div>
		</div>
		<button v-if="!identifier.value" v-on:click="submitData" class="button">
			Submit
		</button>
  </main>
</template>

<script>
	// Import required modules
	import DataForm from '@/views/data/Form';
	import DataMultiSelect from '@/views/data/MultiSelect';
	import DataTable from '@/views/data/Table';
	import caesdb from '@/modules/caesdb';

	// Export the actual component
	export default {
		name: 'DetailMain',
		components: {
			DataForm,
			DataMultiSelect,
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

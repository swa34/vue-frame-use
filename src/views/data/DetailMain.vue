<template lang="html">
  <main>
  	<h1>
  		{{ schema.title }} Detail
  	</h1>
		<!-- We use a data form component to display the main record -->
		<DataForm
			:schema="schema"
			:identifier="identifier"
		/>
		<!-- And data table components to display the main record's associated data -->
		<div v-if="includeAssociations">
			<div v-for="association in schema.associations">
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
  </main>
</template>

<script>
	// Import required modules
	import DataForm from '@/views/data/Form';
	import DataTable from '@/views/data/Table';

	// Export the actual component
	export default {
		name: 'DetailMain',
		components: {
			DataForm,
			DataTable
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

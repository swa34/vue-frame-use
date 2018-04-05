<template lang="html">
  <main>
  	<h1>
  		{{ schema.title }} Detail
  	</h1>
		<DataForm
			:schema="schema"
			:identifier="identifier"
		/>
		<DataTable
			v-if="includeAssociations"
			v-for="association in schema.associations"
			:title="association.title"
			:key="association.schema.table"
			:schema="association.schema"
			:identifier="{ key: association.foreignKey, value: identifier.value}"
			:allowInsert="true"
			:allowEdit="true"
		/>
  </main>
</template>

<script>
	import DataForm from '@/views/data/Form';
	import DataTable from '@/views/data/Table';

	export default {
		name: 'DetailMain',
		components: {
			DataForm,
			DataTable
		},
		props: [
			'schema',
			'identifier',
			'includeAssociations'
		]
	};
</script>

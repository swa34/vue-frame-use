<template lang="html">
  <div id="main">
		<DetailMain
			:schema="schema"
			:includeAssociations="true"
			:identifier="identifier"
		/>
		<pre>{{ schemaLessStore }}</pre>
	</div>
</template>

<script>
	// Import required modules
	import { getComputed, getStore } from '@/modules/store';
	import { stringFormats, url } from '@/modules/utilities';
	import DetailMain from '@/views/DetailMain';
	import schema from '@/schemas/gacounts3/report';

	// Hacky fix for schemas without titles
	if (!schema.title) schema.title = stringFormats.tableToTitle(schema.table);

	// Export the actual component
	export default {
		name: 'App',
		components: { DetailMain },
		computed: {
			...getComputed(schema),
			schemaLessStore: {
				get () {
					let schemaLessStore = Object.assign({}, this.$store.state);
					delete schemaLessStore.schema;
					if (schemaLessStore.subschemas) {
						for (let key in schemaLessStore.subschemas) {
							delete schemaLessStore.subschemas[key].schema;
						}
					}
					return schemaLessStore;
				}
			}
		},
		data () {
			// Fetch identifier parameters from the url
			const key = url.getParam('key');
			const value = url.getParam('value');

			// Return the default data for the component
			return {
				schema,
				identifier: key && value ? {
					key,
					value
				} : false
			};
		},
		store: getStore(schema, !url.getParam('key') || (url.getParam('key') && !url.getParam('value')))
	};
</script>

<style lang="scss">
	table tfoot td {
		color: #fff;
		background-color: lighten(#545959, 20%);
		font-weight: 600;
	}
</style>

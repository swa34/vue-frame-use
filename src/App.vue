<template lang="html">
  <div id="main">
		<DetailMain
			:schema="schema"
			:includeAssociations="true"
			:identifier="identifier"
		/>
		<pre>{{ this.$store.state }}</pre>
	</div>
</template>

<script>
	// Import required modules
	import { getComputed, getStore } from '@/modules/store';
	import { stringFormats, url } from '@/modules/utilities';
	import DetailMain from '@/views/data/DetailMain';
	import schema from '@/schemas/gacounts3/report';

	// Hacky fix for schemas without titles
	if (!schema.title) schema.title = stringFormats.tableToTitle(schema.table);

	// Export the actual component
	export default {
		name: 'App',
		components: { DetailMain },
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
		computed: getComputed(schema),
		store: getStore(schema, !url.getParam('key') || (url.getParam('key') && !url.getParam('value')))
	};
</script>

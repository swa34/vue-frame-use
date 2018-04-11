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
	import DetailMain from '@/views/data/DetailMain';
	import schema from '@/schemas/caes_central_database/oit_websites';
	import { getComputed, getStore } from '@/modules/store';
	import { url } from '@/modules/utilities';

	// Export the actual component
	export default {
		name: 'App',
		components: {
			DetailMain
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
		computed: getComputed(schema),	// Fetches computed values from our store module
		store: getStore(schema, !url.getParam('key') || (url.getParam('key') && !url.getParam('value')))					// Fetches the store from our store module
	};
</script>

<style lang="scss">
	body {
		padding: 0 1rem;
		max-width: 1920px;
		margin: auto;
	}
</style>

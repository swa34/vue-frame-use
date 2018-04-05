<template lang="html">
  <div id="main">
		<DetailMain
			:schema="schema"
			:includeAssociations="true"
			:identifier="identifier"
		/>
	</div>
</template>

<script>
	import DetailMain from '@/views/data/DetailMain';
	import schema from '@/schemas/caes_error_log/application';
	import { url } from '@/modules/utilities';

	export default {
		name: 'App',
		components: {
			DetailMain
		},
		data () {
			return {
				schema,
				identifier: {
					key: url.getParam('key'),
					value: url.getParam('value')
				}
			};
		}
	};
</script>

<style lang="scss">
	body {
		padding: 0 1rem;
		max-width: 1920px;
		margin: auto;
	}
</style>

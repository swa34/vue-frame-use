<template lang="html">
  <div id="main">
		<!-- <ApplicationDetailMain
			:pk_id="pk_id"
			:includeAssociations="true"
		/> -->
		<DatabaseForm
			:schema="schema"
			:identifier="identifier"
		/>
	</div>
</template>

<script>
	import DatabaseForm from '@/views/database/Form';
	import schema from '@/schemas/caes_error_log/application';
	import { url } from '@/modules/utilities';

	export default {
		name: 'App',
		components: {
			DatabaseForm
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

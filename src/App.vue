<template lang="html">
  <div id="main">
		<!-- <ApplicationDetailMain
			:pk_id="pk_id"
			:includeAssociations="true"
		/> -->
		<DatabaseTable
			:schema="schema"
			:identifier="identifier"
			:allowInsert="true"
			:fieldsToDisplay="[
				'DEVELOPER_ID',
				'DATE_CREATED'
			]"
		/>
	</div>
</template>

<script>
	import DatabaseTable from '@/views/DatabaseTable';
	import schema from '@/schemas/caes_error_log/association_developer_application';
	import { url } from '@/modules/utilities';

	export default {
		name: 'App',
		components: {
			DatabaseTable
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

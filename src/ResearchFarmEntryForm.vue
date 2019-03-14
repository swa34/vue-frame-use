<template lang="html">
	<div>
		<DetailMain
			:schema="schema"
			mode="edit"
		/>
	</div>
</template>

<script>
	import schema from '@/schemas/caes_research_farm_project/project';
	import DetailMain from '@/views/DetailMain';
	import {
		getComputed,
		getStore
	} from '@/modules/store';
	import { url } from '@/modules/utilities';
	import { getSortedSchema } from '@/modules/schemaTools';

	export default {
		name: 'ResearchFarmEntryForm',
		components: {
			DetailMain
		},
		data () {
			return {
				schema: getSortedSchema(schema)
			};
		},
		computed: {
			...getComputed(schema),
			identifier () {
				const key = 'ID';
				const duplicate = url.getParam('duplicateID') !== null;
				const value = duplicate ? url.getParam('duplicateID') : url.getParam('PK_ID') || url.getParam('pk_id');

				return {
					key,
					duplicate,
					value
				};
			}
		},
		store: getStore(schema, !url.getParam('key') || (url.getParam('key') && !url.getParam('value')))
	};
</script>

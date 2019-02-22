<template lang="html">
	<div>
		<DetailMain :schema="schema" mode="edit" />
	</div>
</template>

<script>
	import schema from '@/schemas/caes_research_farm_project/project';
	import DetailMain from '@/views/DetailMain';
	import {
		getComputed,
		getStore
	} from '@/modules/store';
	import {
		stringFormats,
		url
	} from '@/modules/utilities';
	import { getSortedSchema } from '@/modules/schemaTools';
	import {
		getCriteriaStructure,
		getDuplicatedReport,
		logError,
		postReportTemplateStatus
	} from '@/modules/caesdb';

	export default {
		name: 'ResearchFarmEntryForm',
		components: {
			DetailMain
		},
		computed: {
			...getComputed(schema)
		},
		data(){
			return {
				schema: getSortedSchema(schema)
			}
		},
		store: getStore(schema, !url.getParam('key') || (url.getParam('key') && !url.getParam('value')))
	}
</script>


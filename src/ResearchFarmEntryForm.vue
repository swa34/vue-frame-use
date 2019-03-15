<template lang="html">
	<div>
		<h1>Research Farm Project</h1>
		<div class="button-container">
			<button type="button" @click="toggleMode">
				{{ mode === 'edit' ? 'View' : 'Edit' }}
			</button>
		</div>
		<DetailMain
			:schema="schema"
			:mode="mode"
			:identifier="identifier"
			:userIsOwner="userIsOriginator"
		/>
	</div>
</template>

<script>
	/* global activeUserId */
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
				mode: 'view',
				schema: getSortedSchema(schema)
			};
		},
		computed: {
			duplicateId () {
				return [
					'duplicateId',
					'duplicateID',
					'DUPLICATEID',
					'duplicateid',
					'DuplicateID',
					'DuplicateId',
					'DuPlIcAtEiD'
				].reduce((duplicateId, param) => {
					if (url.getParam(param) !== null) duplicateId = url.getParam(param);
					return duplicateId;
				}, false);
			},
			...getComputed(schema),
			identifier () {
				const key = 'ID';
				const duplicate = this.isDuplicatedProject;
				const value = duplicate ? this.duplicateId : url.getParam('PK_ID') || url.getParam('pk_id');
				if (!value) return false;
				return {
					key,
					duplicate,
					value
				};
			},
			isDuplicatedProject () { return this.duplicateId !== null && this.duplicateId !== false; },
			isNewProject () { return url.getParam('new') !== null || url.getParam('NEW') !== null; },
			userIsOriginator () { return this.ORIGINATOR_ID === activeUserId; }
		},
		mounted () {
			// This function will only ever be run once
			if (this.isNewProject) this.initializeNewProject();
			this.setDocumentTitle();
		},
		methods: {
			initializeNewProject () {
				this.ORIGINATOR_ID = activeUserId;
				this.mode = 'edit';
			},
			setDocumentTitle () {
				if (this.isNewProject && this.isDuplicatedProject) {
					document.title = `Duplicate Research Farm Project | ${document.title}`;
				} else if (this.isNewProject) {
					document.title = `New Research Farm Project | ${document.title}`;
				} else if (this.mode === 'edit') {
					document.title = `Research Farm Project | ${document.title}`;
				} else {
					document.title = `View Research Farm Project | ${document.title}`;
				}
			},
			toggleMode () { this.mode === 'edit' ? this.mode = 'view' : this.mode = 'edit'; }
		},
		store: getStore(schema, !url.getParam('key') || (url.getParam('key') && !url.getParam('value')))
	};
</script>

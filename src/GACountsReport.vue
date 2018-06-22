<template lang="html">
  <div id="main">
		<DetailMain
			v-if="isNew || identifier !== null"
			:schema="schema"
			:identifier="identifier || false"
		/>
		<div v-else>
			<h2>
				Welcome to the GACounts Single-Page Report Entry
			</h2>
			<p>
				What would you like to do?
			</p>
			<form>
				<label>
					<button type="button" v-on:click="reloadPage">
						Enter a new report
					</button>
				</label>
				<p>
					-- or --
				</p>
				<fieldset>
					<label>
						<span>
							Enter a report ID to lookup an existing report
						</span>
						<input type="number" v-model="inputID" min="0" />
					</label>
					<label>
						<button type="button" v-on:click="reloadPage">
							Go
						</button>
					</label>
				</fieldset>
			</form>
		</div>
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
		name: 'GACountsReport',
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
			// Determine if entering new record
			const isNew = url.getParam('new') !== null;

			// Create our data object to return
			const data = {
				identifier: null,
				inputID: null,
				isNew,
				schema
			};

			// If not entering a new record, we need to get the Report ID
			if (!isNew) {
				const id = url.getParam('PK_ID') || url.getParam('pk_id');
				if (id) {
					data.identifier = {
						key: 'ID',
						value: id
					};
				} else {
					console.error('Neither the "new" parameter or a pkid were found');
				}
			}

			return data;
		},
		methods: {
			reloadPage () {
				if (this.inputID !== null) {
					// Send to existing report
					window.location.href = window.location.href + '&pkid=' + this.inputID;
				} else {
					// Send to new report
					window.location.href = window.location.href + '&new';
				}
			}
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

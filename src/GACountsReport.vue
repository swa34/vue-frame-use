<template lang="html">
  <div id="main">
		<DuplicationModal
			v-if="identifier && identifier.duplicate && !duplication.ready"
			:duplicationSchema="duplicationSchema"
		/>
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
	/* global notify */

	// Import required modules
	import {
		getComputed,
		getStore
	} from '@/modules/store';
	import {
		stringFormats,
		url
	} from '@/modules/utilities';
	import { getSortedSchema } from '@/modules/schemaTools';
	import DetailMain from '@/views/DetailMain';
	import DuplicationModal from '@/views/DuplicationModal';
	import schema from '@/schemas/gacounts3/report';
	import duplicationSchema from '@/schemas/gacounts3/duplication/report';

	// Configure notifications
	notify.setOptions({
		autoHideLogs: true,
		messageHeadings: {
			log: 'Note:'
		}
	});

	// Hacky fix for schemas without titles
	if (!schema.title) schema.title = stringFormats.tableToTitle(schema.table);

	// Sort the schema
	const sortedSchema = getSortedSchema(schema);

	// Export the actual component
	export default {
		name: 'GACountsReport',
		components: {
			DetailMain,
			DuplicationModal
		},
		computed: {
			...getComputed(schema),
			duplication () {
				return this.$store.state.duplication;
			},
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
			const duplicateId = url.getParam('duplicateID') || false;

			// Create our data object to return
			const data = {
				duplicationSchema,
				identifier: null,
				inputID: null,
				isNew,
				schema: sortedSchema,
				watchedFieldsChangeCount: 0,
				watchedFieldsNotified: []
			};

			// If not entering a new record, we need to get the Report ID
			if (!isNew) {
				const id = url.getParam('PK_ID') || url.getParam('pk_id');
				if (id) {
					data.identifier = {
						key: 'ID',
						value: id,
						duplicate: false
					};
				} else {
					console.error('Neither the "new" parameter or a pkid were found');
				}
			} else if (duplicateId) {
				data.identifier = {
					key: 'ID',
					value: duplicateId,
					duplicate: true
				};
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
		mounted () {
			this.watchFields = true;
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
	td input {
		width: 100%;
	}
	ul.checkbox {
		list-style-type: none;
		padding: 0;
		column-count: 2;
		column-width: 7.5rem;
		li {
			break-inside: avoid-column;
			page-break-inside: avoid;
			-webkit-column-break-inside: avoid;
			margin-bottom: .75rem;
			label {
				display: inline-flex;
				span {
					display: flex;
					flex-direction: column;
					justify-content: center;
				}
			}
		}
	}
	.outlined {
		border: 1px solid #000;
		padding: .5rem;
	}
	.margined {
		margin: .5rem;
	}
	button.small {
		font-size: .75rem;
		padding: .5rem;
	}
	a.help-link {
		cursor: pointer;
		svg {
			vertical-align: text-bottom;
		}
	}
	table caption a.help-link svg {
		color: #fff;
	}
</style>

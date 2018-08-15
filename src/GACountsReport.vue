<template lang="html">
  <div id="main">
		<div class="heading-container">
			<h1>Report</h1>
			<div class="spacer"></div>
			<button v-if="!isNew && !userIsOwner && userCanFileSubReport" v-on:click="redirectToSubReportEntry" type="button" class="file-sub-report">
				{{ userCollaboratorRecord.HAS_REPORTED === 0 ? 'File' : 'Edit' }} Sub-Report
			</button>
			<button v-if="!isNew && userCanFileSubReport && userCollaboratorRecord.HAS_REPORTED === 0" v-on:click="redirectToSubReportRejection" type="button" class="reject-sub-report">
				Decline Sub-Report
			</button>
			<button v-if="!isNew" v-on:click="redirectToDuplication" type="button">
				Duplicate
			</button>
			<button v-if="userIsOwner && !isNew" v-on:click="toggleMode" type="button">
				{{ mode === 'edit' ? 'Print View' : 'Edit View' }}
			</button>
		</div>
		<DuplicationModal
			v-if="identifier && identifier.duplicate && !duplication.ready"
			:duplicationSchema="duplicationSchema"
		/>
		<DetailMain
			v-if="isNew || identifier !== null"
			:schema="schema"
			:identifier="identifier || false"
			:mode="mode"
			:userIsOwner="userIsOwner"
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
		<!-- <pre>{{ schemaLessStore }}</pre> -->
	</div>
</template>

<script>
	/* global activeUserID */
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
			},
			userCanFileSubReport () {
				return !this.userCollaboratorRecord.IS_REJECTED;
			},
			userCollaboratorRecord () {
				const userCollaboratorRecordIndex = this.$store.state.collaborators.records.map(r => r.PERSONNEL_ID).indexOf(activeUserID);
				if (userCollaboratorRecordIndex === -1) return {};
				const userCollaboratorRecord = this.$store.state.collaborators.records[userCollaboratorRecordIndex];
				return userCollaboratorRecord;
			},
			userIsOwner () {
				return this.OWNER_ID === activeUserID;
			}
		},
		data () {
			// Determine if entering new record
			const isNew = url.getParam('new') !== null;
			const duplicateId = url.getParam('duplicateID') || false;

			// Create our data object to return
			const data = {
				breadCrumbsHaveNotBeenSet: true,
				duplicationSchema,
				identifier: null,
				inputID: null,
				isNew,
				mode: 'view',
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

			// Set the mode to edit if applicable
			if (isNew) {
				data.mode = 'edit';
			}

			return data;
		},
		methods: {
			redirectToDuplication () {
				window.location = 'https://' + window.location.hostname + '/gacounts3?referenceInterface=REPORT&subInterface=detail_main&new&duplicateID=' + this.ID;
			},
			redirectToSubReportEntry () {
				window.location = 'https://' + window.location.hostname + '/gacounts3?function=NewSubReport&REPORT_ID=' + this.ID + '&PERSONNEL_ID=' + activeUserID;
			},
			redirectToSubReportRejection () {
				window.location = 'https://' + window.location.hostname + '/gacounts3?function=RefuseSubReportInvitation&REPORT_ID=' + this.ID;
			},
			reloadPage () {
				if (this.inputID !== null) {
					// Send to existing report
					window.location.href = window.location.href + '&pkid=' + this.inputID;
				} else {
					// Send to new report
					window.location.href = window.location.href + '&new';
				}
			},
			setBreadCrumbs () {
				const breadCrumbList = document.querySelector('ul.breadcrumbs');
				const addListItem = (url, text) => {
					const item = document.createElement('li');
					const link = document.createElement('a');
					link.setAttribute('href', url);
					link.innerHTML = text + ' ';
					item.appendChild(link);
					breadCrumbList.appendChild(item);
				};
				addListItem('https://' + window.location.hostname + '/gacounts3/index.cfm?function=reporting_index', 'Reports');
				addListItem(window.location, this.TITLE);
			},
			toggleMode () {
				if (this.mode === 'edit') {
					this.mode = 'view';
				} else if (this.mode === 'view') {
					this.mode = 'edit';
				}
			}
		},
		mounted () {
			this.watchFields = true;
			if (this.userIsOwner) this.mode = 'edit';
			if (url.getParam('new') !== null) this.OWNER_ID = activeUserID;
		},
		store: getStore(schema, !url.getParam('key') || (url.getParam('key') && !url.getParam('value'))),
		watch: {
			TITLE () {
				if (!this.isNew && this.breadCrumbsHaveNotBeenSet && this.TITLE !== null && this.TITLE !== '') {
					this.setBreadCrumbs();
					this.breadCrumbsHaveNotBeenSet = false;
				}
			}
		}
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
	h1, h2, h3, h4, h5, h6 {
		&.inline {
			display: inline;
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
			height: 1.125rem;
			vertical-align: sub;
		}
	}
	table caption a.help-link svg {
		color: #fff;
	}
	div.modal-container div.modal div.help-message  {
		h2 {
			margin-top: 0;
		}
		p.new-window-note {
			display: none;
		}
	}
	div.heading-container {
		display: flex;
		align-items: center;
		div.spacer {
			flex-grow: 1;
		}
		button {
			margin-left: 1rem;
			&.file-sub-report {
				background: #406242;
			}
			&.reject-sub-report {
				background: #6C3129;
			}
		}
	}
</style>

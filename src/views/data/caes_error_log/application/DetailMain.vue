<template lang="html">
	<div>
		<h3>
			Application Detail
		</h3>
		<section id="main-record">
			<div class="section-header">
				<h4>
					Main Record
				</h4>
				<span v-if="!editMode" v-on:click="editMode = true" class="waves-effect waves-light btn">
					Edit
				</span>
				<span v-if="editMode" v-on:click="cancelEdit" class="waves-effect waves-light btn">
					Cancel
				</span>
				<span v-if="editMode" v-on:click="saveEdit" class="waves-effect waves-light btn">
					Save
				</span>
			</div>
			<hr />
			<form>
				<label v-for="column in schema">
					<strong>
						{{ column.prettyName || getPrettyColumnName(column.columnName) }}
					</strong>
					<input :type="sqlToHtml(column.type)" v-model="application[column.columnName]" :disabled="column.immutable || !editMode" />
				</label>
			</form>
		</section>
		<section id="developers" v-if="includeAssociations">
			<h4>
				Developers
			</h4>
			<hr />
			<DatabaseTable
				:schema="associationDeveloperApplicationSchema"
				:identifier="associationDeveloperApplicationIdentifier"
				:allowInsert="true"
			/>
		</section>
		<section id="errors" v-if="includeAssociations">
			<h4>
				Errors
			</h4>
			<hr />
			<DatabaseTable
				:schema="errorReportSchema"
				:identifier="errorReportIdentifier"
			/>
		</section>
	</div>
</template>

<script>
	// Import required modules
	import caesdb from '@/modules/caesdb';
	import DatabaseTable from '@/views/database/Table';
	import associationDeveloperApplicationSchema from '@/schemas/caes_error_log/association_developer_application';
	import errorReportSchema from '@/schemas/caes_error_log/error_report';
	import {
		getPrettyColumnName,
		htmlDate,
		sqlToHtml,
		url
	} from '@/modules/utilities';

	// Create an application object
	const application = {};

	// And then populate it with the default columns
	schema.forEach((column) => {
		application[column.columnName] = null;
	});

	// Export the component
	export default {
		name: 'ApplicationDetailMain',
		props: [
			'includeAssociations'
		],
		components: {
			AssociationDeveloperApplicationDetailMain,
			ErrorReportDetailMain
		},
		data () {
			return {
				application,
				applicationOriginal: {},
				schema,
				editMode: url.isEditMode
			};
		},
		methods: {
			getPrettyColumnName,
			sqlToHtml,
			cancelEdit () {
				this.editMode = false;
				this.application = this.applicationOriginal;
			},
			saveEdit () {
				this.editMode = false;
				// You'd send your put request to the server right here
				// And if it was successful, you'd do this:
				this.applicationOriginal = Object.assign({}, this.application);
			}
		},
		mounted () {
			const component = this;
			const pkid = url.getParam('PK_ID') || url.getParam('pk_id');
			if (pkid) {
				const options = {
					db: 'CAES_ERROR_LOG',
					table: 'APPLICATION',
					selector: 'ID',
					value: pkid
				};
				caesdb.getData(options, (err, data) => {
					if (err) console.error(err);
					if (data.success) {
						const application = data.results[0];
						if (application.DATE_CREATED) application.DATE_CREATED = htmlDate(application.DATE_CREATED);
						if (application.DATE_LAST_UPDATED) application.DATE_LAST_UPDATED = htmlDate(application.DATE_LAST_UPDATED);
						component.application = application;
						component.applicationOriginal = Object.assign({}, application);
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	div.section-header {
		display: flex;
		align-items: center;
		h4 {
			margin: 0;
		}
		span.btn {
			margin-right: 1rem;
			&:first-of-type {
				margin-left: 1rem;
			}
			&:last-of-type {
				margin-right: 0;
			}
		}
	}
</style>

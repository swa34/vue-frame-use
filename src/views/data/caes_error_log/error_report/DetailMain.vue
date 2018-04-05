<template lang="html">
  <div>
		<table v-if="displayType === 'table'">
			<thead>
				<tr>
					<th v-for="column in schema" v-if="columnShouldBeDisplayed(column)" :class="columnShouldBeEditable(column) ? 'center' : ''">
						{{ column.prettyName || getPrettyColumnName(column.columnName) }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item in items">
					<td v-for="column in schema" v-if="columnShouldBeDisplayed(column)" :class="columnShouldBeEditable(column) ? 'center' : ''">
						<label v-if="columnShouldBeEditable(column)">
							<input :type="sqlToHtml(column.type)" v-model="item[column.columnName]" />
							<span v-if="sqlToHtml(column.type) === 'checkbox'"></span>
						</label>
						<span v-else>
							{{ item[column.columnName] }}
						</span>
					</td>
				</tr>
			</tbody>
		</table>
		<ul v-else>
			<li v-for="item in items">
				<span v-for="column in schema" v-if="columnShouldBeDisplayed(column)">
					{{ item[column.columnName] }}
				</span>
			</li>
		</ul>
  </div>
</template>

<script>
	import caesdb from '@/modules/caesdb';
	import schema from './schema';
	import { getPrettyColumnName, sqlToHtml, url } from '@/modules/utilities';

	export default {
		name: 'ErrorReportDetailMain',
		props: [
			'displayType',
			'applicationID',
			'fieldsToDisplay',
			'fieldsToEdit'
		],
		data () {
			return {
				items: [],
				schema,
				editMode: url.isEditMode
			};
		},
		methods: {
			columnShouldBeDisplayed (column) {
				return !this.fieldsToDisplay || this.fieldsToDisplay.length === 0 || this.fieldsToDisplay.indexOf(column.columnName) !== -1;
			},
			columnShouldBeEditable (column) {
				return this.fieldsToEdit && this.fieldsToEdit.indexOf(column.columnName) !== -1;
			},
			getPrettyColumnName,
			sqlToHtml
		},
		mounted () {
			const component = this;
			const options = {
				db: 'CAES_ERROR_LOG',
				table: 'ERROR_REPORT',
				selector: 'APPLICATION_ID',
				value: this.applicationID
			};
			caesdb.getData(options, (err, data) => {
				if (err) console.error(err);
				if (data.success) {
					component.items = data.results;
				}
			});
		}
	};
</script>

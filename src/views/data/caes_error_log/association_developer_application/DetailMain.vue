<template lang="html">
  <div>
		<table v-if="displayType === 'table'">
			<thead>
				<tr>
					<th v-for="column in schema" v-if="shouldDisplayColumn(column)">
						{{ column.prettyName || getPrettyColumnName(column.columnName) }}
					</th>
					<th>
						Add/Remove
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item in items">
					<td v-for="column in schema" v-if="shouldDisplayColumn(column)">
						{{ item[column.columnName] }}
					</td>
					<td class="center">
						<span v-on:click="removeFromItems(item)" class="btn-floating btn-small waves-effect waves-light red">
							<i class="material-icons">
								remove
							</i>
						</span>
					</td>
				</tr>
				<tr>
					<td v-for="column in schema" v-if="shouldDisplayColumn(column)">
						<input v-if="sqlToHtml(column.type) === 'number'" type="number" v-model.number="newItem[column.columnName]" />
						<input v-else :type="sqlToHtml(column.type)" v-model="newItem[column.columnName]" />
					</td>
					<td class="center">
						<span v-on:click="addItem" class="btn-floating btn-small waves-effect waves-light blue">
							<i class="material-icons">
								add
							</i>
						</span>
					</td>
				</tr>
			</tbody>
		</table>
		<ul v-else>
			<li v-for="item in items">
				<span v-for="column in schema" v-if="shouldDisplayColumn(column)">
					{{ item[column.columnName] }}
				</span>
			</li>
		</ul>
		<pre>{{ this.$data }}</pre>
  </div>
</template>

<script>
	import caesdb from '@/modules/caesdb';
	import schema from './schema';
	import { getPrettyColumnName, sqlToHtml, url } from '@/modules/utilities';

	export default {
		name: 'AssociationDeveloperApplicationDetailMain',
		props: [
			'displayType',
			'applicationID',
			'fieldsToDisplay'
		],
		data () {
			let newItem = {};
			schema.forEach((column) => {
				newItem[column.columnName] = null;
			});
			return {
				items: [],
				newItem,
				schema,
				editMode: url.isEditMode
			};
		},
		methods: {
			addItem () {
				this.items.push(Object.assign({}, this.newItem));
				for (let key in this.newItem) {
					this.newItem[key] = null;
				}
			},
			getPrettyColumnName,
			removeFromItems (item) {
				this.items.splice(this.items.indexOf(item), 1);
			},
			shouldDisplayColumn (column) {
				return !this.fieldsToDisplay || this.fieldsToDisplay.length === 0 || this.fieldsToDisplay.indexOf(column.columnName) !== -1;
			},
			sqlToHtml
		},
		mounted () {
			const component = this;
			const options = {
				db: 'CAES_ERROR_LOG',
				table: 'ASSOCIATION_DEVELOPER_APPLICATION',
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

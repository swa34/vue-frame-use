<template lang="html">
  <div>
		<label>
			<legend>
				<h3>
					{{ fieldName }}
				</h3>
			</legend>
			<textarea
				v-if="fieldType === 'textarea'"
				v-bind:value="value"
				v-on:input="$emit('input', $event.target.value)"
				:required="field.required"
				:disabled="field.immutable"
			>
				{{ value }}
			</textarea>
			<Editor
				v-else-if="fieldType === 'richtext'"
				v-bind:value="value"
				v-on:input="$emit('input', $event.target.value)"
			/>
			<select
				v-else-if="fieldType === 'select'"
				v-bind:value="value"
				v-on:input="$emit('input', $event.target.value)"
				:required="field.required"
				:disabled="field.immutable"
			>
				<option disabled selected value>
					(Select One)
				</option>
				<option
					v-for="option in field.constraint.values"
					:value="option[field.constraint.foreignKey]"
				>
					{{ option[field.constraint.foreignLabel] }}
				</option>
			</select>
			<input
				v-else
				:type="fieldType"
				v-bind:value="value"
				v-on:input="$emit('input', $event.target.value)"
				:required="field.required"
				:disabled="field.immutable"
			/>
		</label>
	</div>
</template>

<script>
	import Editor from '@tinymce/tinymce-vue';
	import {
		getPrettyColumnName,
		sqlToHtml
	} from '@/modules/utilities';

	export default {
		name: 'SmartInput',
		components: {
			Editor
		},
		computed: {
			fieldName () {
				return this.field.prettyName || getPrettyColumnName(this.field.columnName);
			},
			fieldType () {
				return this.field.inputType || sqlToHtml(this.field);
			}
		},
		props: {
			field: {
				type: Object,
				required: true
			},
			value: {
				type: [
					Boolean,
					Number,
					String
				]
			}
		}
	};
</script>

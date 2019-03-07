<template lang="html">
  <div>
		<label>
			<legend v-if="displayLabel">
				<h3>
					{{ fieldName }}
					<a v-if="field.helpMessageName" v-on:click="$emit('show-help')" class="help-link">
						<HelpCircleIcon />
					</a>
				</h3>
				<p v-if="field.description">
					{{ field.description }}
				</p>
			</legend>
			<textarea
				v-if="fieldType === 'textarea'"
				v-bind:value="value"
				v-on:input="$emit('input', $event.target.value)"
				:required="field.required"
				:disabled="field.immutable"
				:style="field.style"
			>
				{{ value }}
			</textarea>
			<Editor
				v-else-if="fieldType === 'richtext'"
				v-bind:value="value"
				v-on:input="$emit('input', $event.target.value)"
			/>
			<FuzzySelect
				v-else-if="fieldType === 'fuzzyselect'"
				:options="field.constraint.values"
				:value="value"
				@input="$emit('input', $event.target.value)"
			/>
			<select
				v-else-if="fieldType === 'select'"
				v-bind:value="value"
				v-on:input="$emit('input', $event.target.value)"
				v-on:change="$emit('input', $event.target.value)"
				:required="field.required"
				:disabled="field.immutable"
				:style="field.style"
			>
				<option :disabled="!field.allowNullOption" selected value>
					{{ field.allowNullOption ? '(None)' : '(Select One)' }}
				</option>
				<option
					v-for="option in field.constraint.values"
					:value="option[field.constraint.foreignKey]"
				>
					{{ option[field.constraint.foreignLabel] }}
				</option>
			</select>
			<input
				v-else-if="fieldType === 'number'"
				type="number"
				v-bind:value="value"
				v-on:input="$emit('input', $event.target.value)"
				:required="field.required"
				:disabled="field.immutable"
				:style="field.style"
				min="0"
			/>
			<input
				v-else-if="fieldType === 'checkbox'"
				type="checkbox"
				:value="value"
				:required="field.required"
				:disabled="field.immutable"
				:style="field.style"
				@input="$emit('input', $event.target.checked)"
			/>
			<input
				v-else
				:type="fieldType"
				v-bind:value="value"
				v-on:input="$emit('input', $event.target.value)"
				:required="field.required"
				:disabled="field.immutable"
				:style="field.style"
			/>
		</label>
	</div>
</template>

<script>
	import Editor from '@tinymce/tinymce-vue';
	import FuzzySelect from '@/views/elements/FuzzySelect';
	import {
		getPrettyColumnName,
		sqlToHtml
	} from '@/modules/utilities';
	import HelpCircleIcon from 'vue-feather-icons/icons/HelpCircleIcon';

	export default {
		name: 'SmartInput',
		components: {
			Editor,
			FuzzySelect,
			HelpCircleIcon
		},
		computed: {
			fieldName () {
				return this.field.prettyName || getPrettyColumnName(this.field.columnName);
			},
			fieldType () {
				return this.field.inputType || sqlToHtml(this.field);
			}
		},
		methods: {
			updateValue (val) {

			}
		},
		props: {
			displayLabel: {
				type: Boolean,
				default: true
			},
			field: {
				type: Object,
				required: true
			},
			value: {
				type: [
					Number,
					String,
					Boolean
				]
			}
		}
	};
</script>

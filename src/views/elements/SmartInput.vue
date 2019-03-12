<template lang="html">
	<div>
		<label>
			<legend v-if="displayLabel">
				<h3>
					{{ fieldName }}
					<a v-if="field.helpMessageName" class="help-link" @click="$emit('show-help')">
						<HelpCircleIcon />
					</a>
				</h3>
				<p v-if="field.description">
					{{ field.description }}
				</p>
			</legend>
			<textarea
				v-if="fieldType === 'textarea'"
				:value="value"
				:required="field.required"
				:disabled="field.immutable"
				:style="field.style"
				@input="$emit('input', $event.target.value)"
			>
			</textarea>
			<Editor
				v-else-if="fieldType === 'richtext'"
				:value="value"
				@input="$emit('input', $event.target.value)"
			/>
			<FuzzySelect
				v-else-if="fieldType === 'fuzzyselect'"
				:options="field.constraint.values"
				:value="value"
				@input="$emit('input', $event.target.value)"
			/>
			<select
				v-else-if="fieldType === 'select'"
				:value="value"
				:required="field.required"
				:disabled="field.immutable"
				:style="field.style"
				@change="$emit('input', $event.target.value)"
				@input="$emit('input', $event.target.value)"
			>
				<option :disabled="!field.allowNullOption" selected value>
					{{ field.allowNullOption ? '(None)' : '(Select One)' }}
				</option>
				<option
					v-for="option in field.constraint.values"
					:key="option[field.constraint.foreignKey]"
					:value="option[field.constraint.foreignKey]"
				>
					{{ option[field.constraint.foreignLabel] }}
				</option>
			</select>
			<input
				v-else-if="fieldType === 'number'"
				type="number"
				:value="value"
				:required="field.required"
				:disabled="field.immutable"
				:style="field.style"
				min="0"
				@input="$emit('input', $event.target.value)"
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
				v-else-if="fieldType === 'file'"
				type="file"
				:value="value"
				:accepted="field.acceptedTypes ? field.acceptedTypes.join(', ') : false"
				:required="field.required"
				:disabled="field.immutable"
				:style="field.style"
				@input="$emit('input', $event.target.value)"
			/>
			<input
				v-else
				:type="fieldType"
				:value="value"
				:required="field.required"
				:disabled="field.immutable"
				:style="field.style"
				@input="$emit('input', $event.target.value)"
			/>
		</label>
	</div>
</template>

<script>
	import Editor from '@tinymce/tinymce-vue';
	import FuzzySelect from '@/views/elements/FuzzySelect';
	import HelpCircleIcon from 'vue-feather-icons/icons/HelpCircleIcon';
	import {
		getPrettyColumnName,
		sqlToHtml
	} from '@/modules/utilities';

	export default {
		name: 'SmartInput',
		components: {
			Editor,
			FuzzySelect,
			HelpCircleIcon
		},
		data () { return { dependentValue: null }; },
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
				default: null,
				type: [
					Number,
					String,
					Boolean
				]
			}
		},
		computed: {
			dependentColumnValue () {
				if (!this.field.depends || !this.field.depends.column) return null;
				return this.$store.state[this.$store.state.schema.title.toLowerCase()][this.field.depends.column];
			},
			fieldName () { return this.field.prettyName || getPrettyColumnName(this.field.columnName); },
			fieldType () { return this.field.inputType || sqlToHtml(this.field); }
		},
		methods: {
			async updateDependentValue () {
				if (this.field.getDependentValue) this.dependentValue = await this.field.getDependentValue(this.$store);
			}
		},
		watch: {
			dependentColumnValue () { this.updateDependentValue(); },
			dependentValue (newVal) { this.$emit('input', newVal); }
		},
		mounted () { this.updateDependentValue(); }
	};
</script>

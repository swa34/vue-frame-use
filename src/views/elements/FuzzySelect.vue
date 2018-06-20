<template lang="html">
	<fieldset class="fuzzy-select">
		<input type="text" @input="debounceInput" />
		<select v-model="computedValue" :disabled="filteredOptions.length < 1">
			<option v-for="option in filteredOptions" :value="option.key">
				{{ option.label }}
			</option>
		</select>
	</fieldset>
</template>

<script>
	import Fuse from 'fuse.js';
	import debounce from 'debounce';

	export default {
		name: 'FuzzySelect',
		computed: {
			fuse () {
				return new Fuse(this.options.map(o => o.label), this.fuseOptions);
			},
			computedValue: {
				get () {
					return this.value;
				},
				set (val) {
					this.$emit('input', val);
				}
			}
		},
		data () {
			return {
				fuseOptions: {
					includeMatches: true,
					includeScore: true,
					shouldSort: true,
					threshold: 0.45
				},
				filteredOptions: this.options
			};
		},
		methods: {
			debounceInput: debounce(function (e) {
				const searchText = e.target.value;
				let tempArr = [];
				this.fuse.search(searchText).forEach((result) => {
					tempArr.push(this.options[result.item]);
				});
				this.filteredOptions = tempArr.length > 0 ? tempArr : this.options;
				this.computedValue = searchText.length > 0 ? this.filteredOptions[0].key : this.computedValue;
			}, 250)
		},
		props: {
			options: {
				type: Array,
				required: true
			},
			value: {
				type: [
					String,
					Number,
					Boolean
				]
			}
		}
	};
</script>

<style lang="scss" scoped>
	fieldset.fuzzy-select {
		border: none;
		display: flex;
	}
</style>

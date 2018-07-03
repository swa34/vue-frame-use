<template lang="html">
	<fieldset class="fuzzy-select">
		<input v-model="inputText" type="text" @input="debounceInput" />
		<select v-model="computedValue" :disabled="filteredOptions.length < 1">
			<input type="text" />
			<option v-for="option in filteredOptions" v-bind:key="option.key" :value="option.key">
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
			let selectedOptionLabel = '';
			this.options.forEach((option) => {
				if (option.key === this.value) selectedOptionLabel = option.label;
			});
			return {
				fuseOptions: {
					includeMatches: true,
					includeScore: true,
					shouldSort: true,
					threshold: 0.45
				},
				filteredOptions: this.options,
				inputText: selectedOptionLabel
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
		// display: flex;
		input, select {
			width: 100%;
		}
	}
</style>

<template lang="html">
	<div class="fuzzy-select">
		<input v-model="inputText" type="text" @input="debounceInput" />
		<div class="options">
			<span v-for="option in filteredOptions" :id="option.label" v-bind:key="option.key" v-on:click="setValue(option)">
				{{ option.label }}
			</span>
		</div>
	</div>
	<!-- <fieldset class="fuzzy-select">
		<input v-model="inputText" type="text" @input="debounceInput" />
		<select v-model="computedValue" :disabled="filteredOptions.length < 1">
			<input type="text" />
			<option v-for="option in filteredOptions" v-bind:key="option.key" :value="option.key">
				{{ option.label }}
			</option>
		</select>
	</fieldset> -->
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
			}, 250),
			setValue (option) {
				this.computedValue = option.key;
				this.inputText = option.label;
				this.$el.querySelector('input').blur();
			}
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
	div.fuzzy-select {
		position: relative;
		width: 100%;
		input {
			width: 100%;
		}
		input + div.options {
			display: none;
		}
		input:focus + div.options {
			display: block;
		}
		div.options {
			position: absolute;
			z-index: 10;
			width: 100%;
			overflow: auto;
			max-height: 15rem;
			background: #fff;
			border: 1px solid #333;
			&:hover {
				display: block;
			}
			span {
				display: block;
				cursor: pointer;
				padding: .125rem .25rem;
				&:hover {
					background: #6666cc;
					color: #fff;
				}
				&:active {
					background: #fff;
					color: #000;
				}
			}
		}
	}
	// fieldset.fuzzy-select {
	// 	border: none;
	// 	// display: flex;
	// 	input, select {
	// 		width: 100%;
	// 	}
	// }
</style>

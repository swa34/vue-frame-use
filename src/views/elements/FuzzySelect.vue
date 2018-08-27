<template lang="html">
	<div class="fuzzy-select">
		<input v-model="inputText" type="text" @input="debounceInput" />
		<div class="options">
			<span v-for="(option, index) in filteredOptions" :id="option.label" v-bind:key="option.key" v-on:click="setValue(option)" @mouseover="setSelectionIndex(index)" :class="index === inputHandling.selectionIndex ? 'selected' : ''">
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

	// Object holding keycodes for arrow keys
	const keyCodes = {
		up: 38,
		down: 40,
		enter: 13
	};

	export default {
		name: 'FuzzySelect',
		beforeDestroy () {
			delete this.fuse;
		},
		computed: {
			fuse () {
				delete this.fuse;
				return new Fuse(this.options.map(o => o.label), this.fuseOptions);
			},
			computedValue: {
				get () {
					return this.value;
				},
				set (val) {
					this.$emit('input', val);
				}
			},
			inputEl () {
				return this.$el.querySelector('input');
			},
			inputList () {
				return this.$el.querySelectorAll('div.options span');
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
				inputHandling: {
					selectionIndex: -1
				},
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
			setSelectionIndex (index) {
				this.inputHandling.selectionIndex = index;
			},
			setValue (option) {
				this.computedValue = option.key;
				// this.inputText = option.label;
				this.unfocusInput();
				this.inputHandling.selectionIndex = -1;
				this.$emit('addCollaborator');
			},
			unfocusInput () {
				this.inputEl.blur();
				this.$el.focus();
			}
		},
		mounted () {
			this.inputEl.onkeydown = (e) => {
				const keyCode = e.keyCode;
				switch (keyCode) {
					case keyCodes.up:
						if (this.inputHandling.selectionIndex > -1) --this.inputHandling.selectionIndex;
						break;
					case keyCodes.down:
						if (this.inputHandling.selectionIndex < this.filteredOptions.length) ++this.inputHandling.selectionIndex;
						break;
					case keyCodes.enter:
						if (this.inputHandling.selectionIndex >= 0) this.setValue(this.filteredOptions[this.inputHandling.selectionIndex]);
						break;
				}
			};
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
		},
		watch: {
			value () {
				if (this.value === null) this.inputText = '';
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
			margin-bottom: 0;
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
				&.selected {
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

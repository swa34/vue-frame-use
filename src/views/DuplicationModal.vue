<template lang="html">
  <div class="modal" v-on:click="closeModal">
		<div class="container">
			<span class="close">
				<XIcon v-on:click="cancelDuplication" />
			</span>
			<h2>
				{{ duplicationSchema.title }}
			</h2>
			<div>
				<strong class="instruction">
					{{ duplicationSchema.instruction }}
				</strong>
				<ul>
					<li v-for="(section, title) in duplicationSchema.sections">
						<label>
							<input type="checkbox" v-model="section.duplicate" v-bind:key="title" :disabled="!dependenciesMet(section)" />
							<span :class="!dependenciesMet(section) ? 'disabled' : ''">
								{{ title }}
							</span>
						</label>
					</li>
				</ul>
			</div>
			<div class="button-container">
				<button type="button" v-on:click="processDuplicationOptions">
					Go
				</button>
			</div>
		</div>
	</div>
</template>

<script>
	import { XIcon } from 'vue-feather-icons';
	export default {
		name: 'DuplicationModal',
		props: {
			duplicationSchema: {
				type: Object,
				required: true
			}
		},
		components: { XIcon },
		computed: {
			duplication: {
				get () {
					return this.$store.state.duplication;
				},
				set (val) {
					this.$store.state.duplication = val;
				}
			},
			totalDuplicates () {
				let count = 0;
				for (let key in this.sections) {
					if (this.sections[key].duplicate) ++count;
				}
				return count;
			}
		},
		data () {
			return Object.assign({}, this.duplicationSchema);
		},
		methods: {
			cancelDuplication () {
				this.duplication.ready = true;
			},
			closeModal (event) {
				if (event.target.matches('div.modal')) {
					this.cancelDuplication();
				}
			},
			dependenciesMet (section) {
				if (!section.depends) return true;
				let dependenciesMet = true;
				section.depends.forEach((dependency) => {
					if (!this.sections[dependency].duplicate) dependenciesMet = false;
				});
				return dependenciesMet;
			},
			processDuplicationOptions () {
				for (let key in this.sections) {
					const section = this.sections[key];
					if (section.duplicate) {
						if (section.areas.columns && section.areas.columns.length > 0) {
							section.areas.columns.forEach((column) => {
								this.duplication.columns[column] = true;
							});
						}
						if (section.areas.associations && section.areas.associations.length > 0) {
							section.areas.associations.forEach((association) => {
								this.duplication.associations[association] = true;
							});
						}
						if (section.areas.subschemas && section.areas.subschemas.length > 0) {
							section.areas.subschemas.forEach((subschema) => {
								this.duplication.subschemas[subschema] = true;
							});
						}
					}
				}
				this.duplication.ready = true;
			}
		},
		watch: {
			totalDuplicates () {
				for (let key in this.sections) {
					const section = this.sections[key];
					if (!this.dependenciesMet(section)) {
						section.duplicate = false;
					}
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	div.modal {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		width: 100vw;
		height: 100vh;
		background: rgba(0,0,0,.15);
		padding-top: 1rem;
		overflow: auto;
		text-align: center;
		span.close {
			display: block;
			text-align: right;
			svg {
				cursor: pointer;
			}
		}
		div.container {
			background: #fff;
			// width: calc(100% - 2rem);
			max-width: 960px;
			margin: 0 auto;
			padding: 1rem;
			box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
			text-align: center;
			display: inline-block;
			border-radius: .375rem;
			strong.instruction {
				display: block;
				padding: 0 2rem;
			}
			ul {
				list-style-type: none;
				padding: 0;
				display: inline-block;
				li {
					margin-bottom: .75rem;
					label {
						display: flex;
						span {
							display: flex;
							flex-direction: column;
							justify-content: center;
							&.disabled {
								color: #999;
							}
						}
					}
				}
			}
			div.button-container {
				text-align: center;
			}
		}
	}
</style>

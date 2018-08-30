<template lang="html">
  <div class="modal-container" v-if="messageName" v-on:click="closeModal">
		<div class="modal">
			<span class="close">
				<div v-on:click="closeModal">
					<XIcon />
				</div>
			</span>
			<transition appear name="fade">
				<Spinner v-if="helpMessageHTML.length < 1" />
				<div v-else class="help-message" v-html="helpMessageHTML"></div>
			</transition>
		</div>
	</div>
</template>

<script>
	import Spinner from 'vue-simple-spinner';
	import XIcon from 'vue-feather-icons/icons/XIcon';
	import {
		getContextualHelpMessageHTML,
		logError
	} from '@/modules/caesdb';

	export default {
		name: 'ContextualHelpMessage',
		props: {
			messageName: {
				type: String,
				required: true
			}
		},
		components: {
			Spinner,
			XIcon
		},
		data () {
			return {
				helpMessageHTML: ''
			};
		},
		methods: {
			closeModal (event) {
				if (event.target.matches('div.modal-container') || event.target.matches('span.close div') || event.target.matches('svg.feather') || event.target.matches('line')) this.$emit('close-modal');
			}
		},
		mounted () {
			if (!this.messageName) {
				this.$emit('close-modal');
			} else {
				getContextualHelpMessageHTML(this.messageName, (err, data) => {
					if (err) logError(err);
					if (data) {
						if (data.length < 1) this.$emit('close-modal');
						this.helpMessageHTML = data.trim();
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	div.modal-container {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		width: 100vw;
		height: 100vh;
		background: rgba(0,0,0,.15);
		padding-top: 1rem;
		overflow: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		div.modal {
			background: #fff;
			max-width: 960px;
			margin: 0 auto;
			padding: 1rem;
			box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
			display: inline-block;
			border-radius: .375rem;
			text-align: left;
			max-height: 75vh;
			overflow: auto;
			span.close {
				display: block;
				text-align: right;
				float: right;
				div {
					padding: .5rem;
					svg {
						cursor: pointer;
					}
				}
			}
		}
	}
</style>

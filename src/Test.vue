<template lang="html">
  <div id="main">
		<button type="button" v-on:click="helpMessage.show = true">
			Show Message
		</button>
		<ContextualHelpMessage
			:messageName="helpMessage.name"
			v-on:close-modal="helpMessage.show = false"
			v-if="helpMessage.show"
		/>
	</div>
</template>

<script>
	import ContextualHelpMessage from '@/views/data/ContextualHelpMessage';
	export default {
		name: 'Test',
		components: {
			ContextualHelpMessage
		},
		data () {
			return {
				helpMessage: {
					show: false,
					name: 'NewReportScope'
				}
			};
		}
	};
</script>

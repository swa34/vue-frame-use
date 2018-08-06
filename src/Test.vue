<template lang="html">
  <div id="main">
		<input type="text" v-model="useNumber ? number : text" />
		<button type="button" v-on:click="toggleType">
			Toggle
		</button>
		<span>Number: {{ number }}</span>
		<span>Text: {{ text }}</span>
	</div>
</template>

<script>
	export default {
		name: 'Test',
		data () {
			return {
				number: '5',
				text: 'string',
				useNumber: true
			};
		},
		methods: {
			toggleType () {
				this.useNumber = !this.useNumber;
			}
		}
	};
</script>

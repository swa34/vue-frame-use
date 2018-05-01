<template lang="html">
	<div>
		<input type="date" v-model="date" />
		<input type="time" v-model="time" />
	</div>
</template>

<script>
	import dateFormat from 'dateformat';

	export default {
		name: 'DateTime',
		computed: {
			date: {
				get () {
					if (this.value) return dateFormat(this.value, 'yyyy-mm-dd');
					return null;
				},
				set (val) {
					const newValue = val + ' ' + this.time + ':00';
					this.$emit('input', newValue);
				}
			},
			time: {
				get () {
					if (this.value) return dateFormat(this.value, 'HH:MM');
					return null;
				},
				set (val) {
					const newValue = this.date + ' ' + val + ':00';
					this.$emit('input', newValue);
				}
			}
		},
		props: {
			value: {
				type: [
					Number,
					String
				]
			}
		}
	};
</script>

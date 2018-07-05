<template lang="html">
  <div id="main">
		<pre>{{ JSON.stringify(activityList, null, 2) }}</pre>
	</div>
</template>

<script>
	import { get4HActivityList } from '@/modules/caesdb';

	export default {
		name: 'Test',
		data () {
			return {
				activityList: {}
			};
		},
		mounted () {
			get4HActivityList('barrow', (err, data) => {
				if (err) console.error(err);
				if (data) this.activityList = data;
			});
		}
	};
</script>

<template lang="html">
  <div id="main">
		<pre>{{ JSON.stringify(response, null, 2) }}</pre>
	</div>
</template>

<script>
	import request from 'superagent';

	export default {
		name: 'Test',
		data () {
			return {
				response: null
			};
		},
		mounted () {
			request.get('/rest/gacounts-api/genders.json')
				.end((err, response) => {
					if (err) console.error(err);
					this.response = response.body;
				});
		}
	};
</script>

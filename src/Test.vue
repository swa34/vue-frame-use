<template lang="html">
  <div id="main">
		<pre>{{ JSON.stringify(schemaSections, null, 2) }}</pre>
	</div>
</template>

<script>
	import schema from '@/schemas/gacounts3/report';
	import { getSchemaSections } from '@/modules/schemaTools';

	export default {
		name: 'Test',
		data () {
			return {
				schemaSections: getSchemaSections(schema)
			};
		}
	};
</script>

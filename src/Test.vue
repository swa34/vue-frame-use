<template lang="html">
  <div id="main">
		<FuzzySelect
			v-model="personnelID"
			:options="options"
		/>
		<pre>{{ JSON.stringify(this.personnelID, null, 2) }}</pre>
	</div>
</template>

<script>
	import FuzzySelect from '@/views/elements/FuzzySelect';
	import personnel from '@/personnel';

	export default {
		name: 'Test',
		components: {
			FuzzySelect
		},
		computed: {
			options () {
				return this.personnel.map((p) => {
					return {
						key: p.ID,
						label: [p.FIRST_NAME, p.MIDDLE_NAME, p.LAST_NAME].join(' ')
					};
				});
			}
		},
		data () {
			return {
				personnel,
				personnelID: null
			};
		}
	};
</script>

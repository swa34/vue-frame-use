<template lang="html">
  <div id="main">
		<select id="slim">
			<option value="gabe">Gabe</option>
			<option value="otis">Otis</option>
			<option value="benson">Benson</option>
		</select>
	</div>
</template>

<script>
	/* global SlimSelect */

	export default {
		name: 'Test',
		mounted () {
			const slimSelect = new SlimSelect({
				select: 'select#slim'
			});
		}
	};
</script>

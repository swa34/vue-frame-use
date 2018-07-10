<template lang="html">
  <div>
		<h2>
			Duplication
		</h2>
		<p>
			<strong>
				Please select which sections you would like to duplicate:
			</strong>
			<ul>
				<li v-for="(section, title) in sections">
					<label>
						<input type="checkbox" v-model="section.duplicate" v-bind:key="title" />
						<span>
							{{ title }}
						</span>
					</label>
				</li>
			</ul>
		</p>
		<button type="button" v-on:click="processDuplicationOptions">
			Submit
		</button>
	</div>
</template>

<script>
	export default {
		name: 'DuplicationModal',
		computed: {
			duplication: {
				get () {
					return this.$store.state.duplication;
				},
				set (val) {
					this.$store.state.duplication = val;
				}
			}
		},
		data () {
			return {
				sections: {
					'Title': {
						duplicate: true,
						areas: {
							columns: [
								'TITLE'
							]
						}
					},
					'Location Information': {
						duplicate: true,
						areas: {
							columns: [
								'SCOPE_ID',
								'ACTIVITY_LOCATION_TYPE_ID',
								'COUNTY_ID',
								'ACTIVITY_LOCATION_ALTERNATE_TEXT'
							]
						}
					},
					'Dates': {
						duplicate: false,
						areas: {
							columns: [
								'DATE_BEGIN',
								'DATE_END'
							]
						}
					},
					'Program Areas': {
						duplicate: true,
						areas: {
							associations: [
								'programAreas'
							]
						}
					},
					'Report Type': {
						duplicate: true,
						areas: {
							associations: [
								'reportType'
							]
						}
					},
					'Topics and Keywords': {
						duplicate: false,
						areas: {
							associations: [
								'topics',
								'keywords'
							]
						}
					},
					'Demographic Information': {
						title: 'Demographic Information',
						duplicate: false,
						areas: {
							associations: [
								'contacts',
								'racialDemographics',
								'ethnicDemographics',
								'targetAudiences'
							]
						}
					},
					'Supplemental Data': {
						duplicate: false,
						areas: {
							associations: [
								'supplementalData'
							]
						}
					},
					'Sub-Report': {
						duplicate: false,
						areas: {
							subschemas: [
								'subReport'
							]
						}
					},
					'Collaborators': {
						title: 'Collaborators',
						duplicate: false,
						areas: {
							associations: [
								'collaborators'
							]
						}
					}
				}
			};
		},
		methods: {
			processDuplicationOptions () {
				console.log('Button clicked');
				for (let key in this.sections) {
					console.log(key);
					const section = this.sections[key];
					console.log(section.duplicate);
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
		}
	};
</script>

<style lang="scss" scoped>
</style>

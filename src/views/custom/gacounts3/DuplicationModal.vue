<template lang="html">
  <div>
		<h2>
			Report Duplication
		</h2>
		<p>
			<strong>
				Please select which sections you would like to duplicate:
			</strong>
			<ul>
				<li v-for="(section, title) in sections">
					<label>
						<input type="checkbox" v-model="section.duplicate" v-bind:key="title" :disabled="!dependenciesMet(section)" />
						<span :class="!dependenciesMet(section) ? 'disabled' : ''">
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
			},
			totalDuplicates () {
				let count = 0;
				for (let key in this.sections) {
					if (this.sections[key].duplicate) ++count;
				}
				return count;
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
						},
						depends: [
							'Program Areas'
						]
					},
					'Topics and Keywords': {
						duplicate: false,
						areas: {
							associations: [
								'topics',
								'keywords'
							]
						},
						depends: [
							'Program Areas',
							'Report Type'
						]
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
						},
						depends: [
							'Program Areas',
							'Report Type',
							'Topics and Keywords'
						]
					},
					'Supplemental Data': {
						duplicate: false,
						areas: {
							associations: [
								'supplementalData'
							]
						},
						depends: [
							'Program Areas',
							'Report Type',
							'Topics and Keywords'
						]
					},
					'Sub-Report': {
						duplicate: false,
						areas: {
							subschemas: [
								'subReport'
							]
						},
						depends: [
							'Program Areas',
							'Report Type',
							'Topics and Keywords'
						]
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
			dependenciesMet (section) {
				if (!section.depends) return true;
				let dependenciesMet = true;
				section.depends.forEach((dependency) => {
					if (!this.sections[dependency].duplicate) dependenciesMet = false;
				});
				return dependenciesMet;
			},
			processDuplicationOptions () {
				for (let key in this.sections) {
					const section = this.sections[key];
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
		},
		watch: {
			totalDuplicates () {
				for (let key in this.sections) {
					const section = this.sections[key];
					if (!this.dependenciesMet(section)) {
						section.duplicate = false;
					}
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	ul {
		list-style-type: none;
		padding: 0;
		li {
			margin-bottom: .75rem;
			label {
				display: flex;
				span {
					display: flex;
					flex-direction: column;
					justify-content: center;
					&.disabled {
						color: #999;
					}
				}
			}
		}
	}
</style>

<template lang="html">
	<table v-if="dependenciesMet">
		<caption>
			Supplemental Data
		</caption>
		<thead>
			<tr>
				<th>
					Field
				</th>
				<th>
					Value
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="field in reportFields">
				<td>
					{{ field.REPORT_FIELD_LABEL }}
				</td>
				<td>

				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
	import {
		getCriteriaStructure,
		getFieldTypes,
		getAssociationReportTypeField
	} from '@/modules/caesdb';
	import {
		cfToJs,
		filter,
		jsToCf
	} from '@/modules/criteriaUtils';
	export default {
		name: 'SupplementalData',
		computed: {
			dependenciesMet () {
				return this.programAreas.length > 0 && this.reportType !== null && this.topics.length > 0;
			},
			fieldIDs () {
				return this.reportFields.map(f => f.FIELD_ID);
			},
			fieldTypeIDs () {
				return this.fieldTypes.map(t => t.ID);
			},
			programAreas () {
				return this.$store.state.programAreas.records.map(r => r.AREA_ID);
			},
			records: {
				get () {
					return this.$store.state.supplementalData.records;
				},
				set (val) {
					this.$store.state.supplementalData.records = val;
				}
			},
			reportFieldCriteriaStructure () {
				let criteriaStructure = Object.assign({}, this.criteriaStructureTemplates.reportField);
				criteriaStructure.criteria_TYPE_ID_eq = [this.reportType];
				criteriaStructure.criteria_AREA_ID_eq = this.programAreas;
				criteriaStructure.criteria_TOPIC_ID_eq = this.topics;
				return criteriaStructure;
			},
			reportFieldCriteriaStructureForCF () {
				return jsToCf(this.reportFieldCriteriaStructure);
			},
			reportID () {
				return this.$store.state.report.ID;
			},
			reportType () {
				const reportTypeRecords = this.$store.state.reportType.records;
				return reportTypeRecords.length > 0 ? reportTypeRecords[0].TYPE_ID : null;
			},
			topics () {
				return this.$store.state.topics.records.map(r => r.TOPIC_ID);
			}
		},
		data () {
			return {
				criteriaStructureTemplates: {
					fieldOption: {},
					reportField: {}
				},
				fieldTypes: [],
				reportFields: []
			};
		},
		methods: {
			populateReportFields () {
				// console.log(this.reportFieldCriteriaStructure);
				getAssociationReportTypeField(this.reportFieldCriteriaStructureForCF, (err, data) => {
					if (err) console.error(err);
					if (data) this.reportFields = data;
				});
			}
		},
		mounted () {
			getCriteriaStructure('GC3_FIELD_OPTION', (err, data) => {
				if (err) console.error(err);
				if (data) this.criteriaStructureTemplates.fieldOption = cfToJs(data);
			});
			getCriteriaStructure('GC3_ASSOCIATION_REPORT_TYPE_FIELD', (err, data) => {
				if (err) console.error(err);
				if (data) this.criteriaStructureTemplates.reportField = cfToJs(data);
			});
			getFieldTypes((err, data) => {
				if (err) console.error(err);
				if (data) this.fieldTypes = data;
			});
		},
		watch: {
			dependenciesMet (newStatus, oldStatus) {
				if (newStatus === true) {
					// Dependencies are met, so we need to fetch data based on our initial
					// options
					this.populateReportFields();
				}
			},
			programAreas (newAreas, oldAreas) {
				// Only do anything if dependencies are met
				if (this.dependenciesMet) {
					if (oldAreas.length > newAreas.length) {
						// A program area has been removed, so we just need to filter our
						// existing fields.
						this.reportFields = filter(this.reportFields, this.reportFieldCriteriaStructure);
					} else {
						// A program area has been added, so we need to fetch missing fields
						// based on the added area
						const criteriaStructure = Object.assign({}, this.reportFieldCriteriaStructure);
						criteriaStructure.criteria_AREA_ID_eq = newAreas.filter(val => oldAreas.indexOf(val) === -1);
						criteriaStructure.criteria_FIELD_ID_neq = this.fieldIDs;
						getAssociationReportTypeField(jsToCf(criteriaStructure), (err, data) => {
							if (err) console.error(err);
							if (data) this.reportFields = this.reportFields.concat(data);
							if (data) console.log(data);
						});
					}
				}
			},
			reportType (newType, oldType) {
				// Only do anything if dependencies are met
				if (this.dependenciesMet) {
					// We need to fetch new fields based on the new report type
					this.populateReportFields();
				}
			},
			topics (newTopics, oldTopics) {
				// Only do anything if dependencies are met
				if (this.dependenciesMet) {
					if (oldTopics.length > newTopics.length) {
						// A topic has been removed, so we just need to filter out existing
						// fields
						this.reportFields = filter(this.reportFields, this.reportFieldCriteriaStructure);
					} else {
						// A topic has been added, so we need to fetch missing fields based
						// on the added topic
						const criteriaStructure = Object.assign({}, this.reportFieldCriteriaStructure);
						criteriaStructure.criteria_TOPIC_ID_eq = newTopics.filter(val => oldTopics.indexOf(val) === -1);
						criteriaStructure.criteria_FIELD_ID_neq = this.fieldIDs;
						getAssociationReportTypeField(jsToCf(criteriaStructure), (err, data) => {
							if (err) console.error(err);
							if (data) this.reportFields = this.reportFields.concat(data);
						});
					}
				}
			}
		}
	};
</script>

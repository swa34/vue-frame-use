<template lang="html">
	<table v-if="dependenciesMet && records.length > 0">
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
			<tr v-for="record in records">
				<td>
					{{ reportFields[fieldIDs.indexOf(record.FIELD_ID)].REPORT_FIELD_LABEL }}
				</td>
				<td>
					<select v-if="getFieldInputType(record) === 'select'" v-model="record.FIELD_VALUE">
						<option v-for="option in getFieldOptions(record)" :value="option.ID">
							{{ option.LABEL }}
						</option>
					</select>
					<input v-else-if="getFieldInputType(record) === 'number'" v-model="record.FIELD_VALUE" type="number" step="any" />
					<input v-else v-model="record.FIELD_VALUE" :type="getFieldInputType(record)" />
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
	import {
		getAssociationReportField,
		getAssociationReportTypeField,
		getAssociationSubReportField,
		getCriteriaStructure,
		getFieldOptions,
		getFieldTypes
	} from '@/modules/caesdb';
	import {
		cfToJs,
		filter,
		jsToCf
	} from '@/modules/criteriaUtils';
	import { url } from '@/modules/utilities';

	// An object containing input types corresponding to field types
	const fieldTypeInputTypes = {
		'Integer Data': 'number',
		'String Data': 'text',
		'Decimal Data': 'number',
		'Option Data': 'select',
		'Boolean Data': 'checkbox',
		'Department Data': 'select'
	};

	export default {
		name: 'SupplementalData',
		props: {
			forSubReport: {
				type: Boolean,
				default: false
			}
		},
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
			fieldTypesIndexedByID () {
				let fieldTypes = {};
				this.fieldTypes.forEach((type) => {
					fieldTypes[type.ID] = {
						DISPLAY_TEXT: type.DISPLAY_TEXT,
						LABEL: type.LABEL,
						inputType: fieldTypeInputTypes[type.LABEL] || 'text'
					};
				});
				return fieldTypes;
			},
			programAreas () {
				return this.$store.state.programAreas.records.map(r => r.AREA_ID);
			},
			records: {
				get () {
					return this.forSubReport ? this.$store.state.subschemas.subReport.supplementalData.records : this.$store.state.supplementalData.records;
				},
				set (val) {
					if (this.forSubReport) {
						this.$store.state.subschemas.subReport.supplementalData.records = val;
					} else {
						this.$store.state.supplementalData.records = val;
					}
				}
			},
			recordFieldIDs () {
				return this.records.map(r => r.FIELD_ID);
			},
			reportFieldCriteriaStructure () {
				let criteriaStructure = Object.assign({}, this.criteriaStructureTemplates.reportField);
				criteriaStructure.criteria_TYPE_ID_eq = [this.reportType];
				criteriaStructure.criteria_AREA_ID_eq = this.programAreas;
				criteriaStructure.criteria_TOPIC_ID_eq = this.topics;
				if (this.forSubReport) {
					criteriaStructure.criteria_FOR_SUB_REPORT_eq = [1];
				} else {
					criteriaStructure.criteria_FOR_REPORT_eq = [1];
				}
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
				existingRecords: [],
				fieldOptions: [],
				fieldTypes: [],
				reportFields: []
			};
		},
		methods: {
			getFieldFromRecord (record) {
				return this.reportFields[this.fieldIDs.indexOf(record.FIELD_ID)];
			},
			getFieldInputType (record) {
				const field = this.reportFields[this.fieldIDs.indexOf(record.FIELD_ID)];
				return this.fieldTypesIndexedByID[field.REPORT_FIELD_TYPE_ID].inputType;
			},
			getFieldOptions (record) {
				const field = this.getFieldFromRecord(record);
				let options = [];
				this.fieldOptions.forEach((option) => {
					if (option.FIELD_ID === field.FIELD_ID) options.push(option);
				});
				return options;
			},
			populateRecords () {
				const generateRecord = (field, value = null) => {
					return {
						REPORT_ID: null,
						FIELD_ID: field.FIELD_ID,
						FIELD_VALUE: value
					};
				};
				let records = [];
				this.reportFields.forEach((field) => {
					const indexOfField = this.recordFieldIDs.indexOf(field.FIELD_ID);
					const indexOfExistingRecord = this.existingRecords.map(r => r.FIELD_ID).indexOf(field.FIELD_ID);
					if (indexOfField === -1) {
						if (indexOfExistingRecord !== -1) {
							records.push(generateRecord(field, this.existingRecords[indexOfExistingRecord].FIELD_VALUE));
						} else {
							records.push(generateRecord(field));
						}
					} else {
						records.push(this.records[indexOfField]);
					}
				});
				this.records = records;
			},
			populateReportFields () {
				getAssociationReportTypeField(this.reportFieldCriteriaStructureForCF, (err, data) => {
					if (err) console.error(err);
					if (data) {
						console.log(data);
						let uniqueFields = [];
						let newReportFields = [];
						data.forEach((field) => {
							if (uniqueFields.map(f => f.FIELD_ID).indexOf(field.FIELD_ID) === -1) {
								uniqueFields.push(field);
								const existingFieldIndex = this.fieldIDs.indexOf(field.FIELD_ID);
								if (existingFieldIndex === -1) {
									newReportFields.push(field);
								} else {
									newReportFields.push(this.reportFields[existingFieldIndex]);
								}
							}
						});
						this.reportFields = newReportFields;
					}
				});
			}
		},
		mounted () {
			// Fetch some things we need
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

			const fetchExistingRecords = (reportID) => {
				const tablePrefix = this.forSubReport ? 'GC3_ASSOCIATION_SUB_REPORT_FIELD' : 'GC3_ASSOCIATION_REPORT_FIELD';
				const getFields = this.forSubReport ? getAssociationSubReportField : getAssociationReportField;
				getCriteriaStructure(tablePrefix, (err, data) => {
					if (err) console.error(err);
					if (data.Message) {
						console.error(new Error(data.Message));
					} else {
						let critStruct = cfToJs(data);
						critStruct.criteria_REPORT_ID_eq = reportID;
						getFields(jsToCf(critStruct), (err, data) => {
							if (err) console.error(err);
							if (data.Message) {
								console.error(new Error(data.Message));
							} else {
								this.existingRecords = data;
								// data.forEach((existingRecord) => {
								// 	console.log(this.records.length);
								// 	this.records.forEach((record) => {
								// 		if (record.FIELD_ID === existingRecord.FIELD_ID) {
								// 			console.log('match found');
								// 			for (let key in record) {
								// 				if (existingRecord.hasOwnProperty(key)) record[key] = existingRecord[key];
								// 			}
								// 		}
								// 	});
								// });
							}
						});
					}
				});
			};
			let reportID = url.getParam('PK_ID') || url.getParam('pk_id');
			if (reportID && !url.getParam('new') && !this.forSubReport) fetchExistingRecords(reportID);
		},
		watch: {
			// dependenciesMet (newStatus, oldStatus) {
			// 	if (newStatus === true) {
			// 		// Dependencies are met, so we need to fetch data based on our initial
			// 		// options
			// 		this.populateReportFields();
			// 	}
			// },
			fieldIDs (newFieldIDs, oldFieldIDs) {
				// Populate records with updated fields
				this.populateRecords();
				// A function to fetch options for fields that need them
				const fetchOptions = (fieldsThatNeedOptions) => {
					const criteriaStructure = Object.assign({}, this.criteriaStructureTemplates.fieldOption);
					criteriaStructure.criteria_FIELD_ID_eq = fieldsThatNeedOptions;
					getFieldOptions(jsToCf(criteriaStructure), (err, data) => {
						if (err) console.error(err);
						if (data) {
							data.forEach((fieldOption) => {
								if (this.fieldOptions.map(o => o.ID).indexOf(fieldOption.ID) === -1) this.fieldOptions.push(fieldOption);
							});
						}
					});
				};

				// A function to check if any fields need options
				const checkForNeededOptions = () => {
					// Create an array to hold field IDs that need options
					const fieldsThatNeedOptions = [];
					// Then check to see if any of them are the field types that need
					// field options fetched by looping through each of the fields
					this.reportFields.forEach((field) => {
						// And checking if they're one of the new fields *and* if their type
						// needs options
						if (diffedIDs.indexOf(field.FIELD_ID) !== -1 && this.fieldTypesIndexedByID[field.REPORT_FIELD_TYPE_ID].LABEL === 'Option Data') {
							// If it meets that criteria, it needs options so push it into the
							// array
							fieldsThatNeedOptions.push(field.FIELD_ID);
						}
					});
					if (fieldsThatNeedOptions.length > 0) fetchOptions(fieldsThatNeedOptions);
				};

				// Get an array of new IDs (if any)
				const diffedIDs = newFieldIDs.filter(val => oldFieldIDs.indexOf(val) === -1);
				// If there are actually any new IDs, run our option fetcher function
				if (diffedIDs.length > 0) checkForNeededOptions();
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
							if (data) {
								data.forEach((field) => {
									if (this.fieldIDs.indexOf(field.FIELD_ID) === -1) this.reportFields.push(field);
								});
							}
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
							if (data) {
								data.forEach((field) => {
									if (this.fieldIDs.indexOf(field.FIELD_ID) === -1) this.reportFields.push(field);
								});
							}
						});
					}
				}
			}
		}
	};
</script>

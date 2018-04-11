import { stringFormats } from '@/modules/utilities';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const getMapState = (schema) => {
	const schemaCamelTitle = stringFormats.camelCase(schema.title);
	const columns = [];
	schema.columns.forEach((column) => {
		columns.push(column.columnName);
	});
	return Vuex.mapState(schemaCamelTitle, columns);
};

const getComputed = (schema) => {
	const config = {};
	schema.columns.forEach((column) => {
		config[column.columnName] = {
			get () {
				const schemaCamelTitle = this.schema.title.replace(/\s(.)/g, $1 => $1.toUpperCase()).replace(/\s/g, '').replace(/^(.)/, $1 => $1.toLowerCase());
				return this.$store.state[schemaCamelTitle][column.columnName];
			},
			set (val) {
				const schemaCamelTitle = this.schema.title.replace(/\s(.)/g, $1 => $1.toUpperCase()).replace(/\s/g, '').replace(/^(.)/, $1 => $1.toLowerCase());
				this.$store.state[schemaCamelTitle][column.columnName] = val;
			}
		};
	});
	return config;
};

const getStore = (schema, isNew = false) => {
	// Create a config object that will eventually be passed into Vuex.Store() to
	// generate our store
	const schemaCamelTitle = stringFormats.camelCase(schema.title);
	const config = {
		modules: {
			[schemaCamelTitle]: {
				namespaced: true,
				state: {}
			}
		}
	};

	schema.columns.forEach((column) => {
		config.modules[schemaCamelTitle].state[column.columnName] = column.default || null;
	});

	if (schema.associations) {
		schema.associations.forEach((association) => {
			if ((isNew && association.isAssignable) || !isNew) {
				const associationCamelTitle = stringFormats.camelCase(association.title);
				if (!config.modules[associationCamelTitle]) {
					config.modules[associationCamelTitle] = {
						namespaced: true,
						state: {
							records: []
						}
					};
				}
			}
		});
	}

	const store = new Vuex.Store(config);
	return store;
};

export {
	getComputed,
	getMapState,
	getStore
};

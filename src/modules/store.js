// Pull in required modules
import { stringFormats } from '~/modules/utilities';
import Cookies from 'js-cookie';
import Vue from 'vue';
import Vuex from 'vuex';

// Tell Vue to use Vuex (the datastore)
Vue.use(Vuex);

// Generations a Map State, which tells components where to get/set data in the
// store.
const getMapState = schema => {
	// Basically you just get the camelcase title of the schema
	const schemaCamelTitle = stringFormats.camelCase(schema.title);

	// Create an empty array to hold the columns from the schema
	const columns = [];

	// Then push each of those column names into the columns array
	schema.columns.forEach(column => {
		columns.push(column.columnName);
	});


	// Then return what we get from Vuex's mapState function, which is what
	// actually generates the mapState
	return Vuex.mapState(schemaCamelTitle, columns);
};

// Generates the computed values for a component, which is what
// defines the actions to take when getting/setting values from/in the store.
const getComputed = schema => {
	// Just create an empty config object
	const config = {};

	// Then loop through each of the schema's columns
	schema.columns.forEach(column => {
		// For each column, we define a getter and setter method for that value.
		// Both are simple, they just fetch the value from the store, and set the
		// value in the store.
		// Note that we can't use our handy stringFormats.camelCase() function here,
		// because it would be outside of the scope of the get() and set() functions
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

// Create a store config, to be used to create a store
const getStoreConfig = (schema, isNew = false) => {
	const schemaCamelTitle = stringFormats.camelCase(schema.title);

	// Create a config object that will eventually be passed into Vuex.Store() to
	// generate our store
	const config = {
		modules: {
			schema: {
				namespaced: true,
				state: schema
			},
			duplication: {
				namespaced: true,
				state: {
					ready: false,
					reportID: null,
					columns: {},
					associations: {},
					subschemas: {}
				}
			},
			preferences: {
				namespaced: true,
				state: {
					showNotificationsForChanges: Cookies.get('showNotificationsForChanges') ? JSON.parse(Cookies.get('showNotificationsForChanges')) : true
				},
				mutations: {
					hideNotifications (state) {
						state.showNotificationsForChanges = false;
						Cookies.set('showNotificationsForChanges', false);
					},
					showNotifications (state) {
						state.showNotificationsForChanges = true;
						Cookies.set('showNotificationsForChanges', true);
					}
				}
			},
			[schemaCamelTitle]: {
				namespaced: true,
				state: {
					_fetched: false
				}
			}
		}
	};

	// For each column, push it into the config module, using either the specified
	// default value or null
	schema.columns.forEach(column => {
		const hasDefault = column.default !== null && column.default !== undefined;
		config.modules[schemaCamelTitle].state[column.columnName] = hasDefault ? column.default : null;
	});

	// If the schema has associations, we need to set up the extra modules for the
	// store
	if (schema.associations)

		// So, for each association
		schema.associations.forEach(association => {
			// As long as we're working with a 'new' form, and the association is
			// assignable, just add a module to the store with an empty array to hold
			// the records that will be attached by the user.
			if (isNew && (association.isAssignable || association.multiSelect) || !isNew) {
				const associationCamelTitle = stringFormats.camelCase(association.title);
				if (!config.modules[associationCamelTitle]) config.modules[associationCamelTitle] = {
					namespaced: true,
					mutations: {
						setRecords (state, payload) {
							state.records = payload.records;
						}
					},
					state: {
						fetched: false,
						records: []
					}
				};
			}
		});


	// If the schema has subschemas, we need to set up extra modules for those too
	if (schema.subschemas) {
		config.modules.subschemas = {
			modules: {},
			namespaced: true,
			state: {
				fetched: false
			}
		};
		schema.subschemas.forEach(subschema => {
			const subSchemaCamelTitle = stringFormats.camelCase(subschema.title);
			if (!config.modules.subschemas.modules[subSchemaCamelTitle]) config.modules.subschemas.modules[subSchemaCamelTitle] = getStoreConfig(subschema.schema);
		});
	}

	return config;
};

// Creates the actual data store, based on the schema passed in
const getStore = (schema, isNew = false) => {
	const store = new Vuex.Store(getStoreConfig(schema));

	return store;
};

// Export our functions
export {
	getComputed,
	getMapState,
	getStore,
	getStoreConfig
};

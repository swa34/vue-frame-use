import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const main = (schema) => {
	const store = new Vuex.Store(schema);
	return store;
};

export default main;

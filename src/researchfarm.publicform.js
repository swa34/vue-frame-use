// Polyfill for URL api and IE11
import 'url-polyfill';

// Polyfill for Element.matches and IE11
import 'element-matches';

// Import our main App
import ResearchFarmEntryForm from '~/ResearchFarmEntryForm';
import Vue from 'vue';
import { logError } from '~/modules/caesdb';

Vue.filter('capitalize', str => {
	if (!str) return '';
	str = str.toString();

	return str.charAt(0).toUpperCase() + str.slice(1);
});

Vue.config.errorHandler = logError;
Vue.config.warnHandler = logError;

const app = new Vue({
	el: '#app',
	render: h => h(ResearchFarmEntryForm)

	// Render: h => h(Test)
});

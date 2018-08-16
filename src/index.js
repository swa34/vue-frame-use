// Polyfill for URL api and IE11
import 'url-polyfill';
// Polyfill for Element.matches and IE11
import 'element-matches';
// Import our main App
import GACountsReport from '@/GACountsReport';
// import Test from '@/Test';
import Vue from 'vue';

Vue.filter('capitalize', (str) => {
	if (!str) return '';
	str = str.toString();
	return str.charAt(0).toUpperCase() + str.slice(1);
});

const app = new Vue({
	el: '#app',
	render: h => h(GACountsReport)
	// render: h => h(Test)
});

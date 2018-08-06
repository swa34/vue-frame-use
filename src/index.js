import GACountsReport from '@/GACountsReport.vue';
// import Test from '@/Test';
import Vue from 'vue';

const app = new Vue({
	el: '#app',
	render: h => h(GACountsReport)
	// render: h => h(Test)
});

document.querySelector('form').addEventListener('submit', () => {
	return false;
});

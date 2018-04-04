import App from '@/App.vue';
import 'normalize.css/normalize.css';
import 'milligram-scss';
import Vue from 'vue';

const app = new Vue({
	el: '#app',
	render: h => h(App)
});

import App from '@/App.vue';
// import Test from '@/Test';
// import 'normalize.css/normalize.css';
// import 'milligram-scss';
import Vue from 'vue';
import VueSweetAlert2 from 'vue-sweetalert2';

Vue.use(VueSweetAlert2);

const app = new Vue({
	el: '#app',
	render: h => h(App)
});

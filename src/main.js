import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from "vue-axios";
import App from './components/App.vue'
import store from './store'

Vue.prototype.$axios = axios;
axios.defaults.withCredentials = true;
axios.defaults.headers = {'X-Requested-With': 'http://localhost:8080'};
Vue.use(ElementUI);
Vue.use(VueAxios, axios);
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

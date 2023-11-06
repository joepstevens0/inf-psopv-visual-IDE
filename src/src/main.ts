import Vue from "vue";
import App from "./App.vue";
import Axios from "axios";
import store from "./store.js";
import router from "./router.js";
import VueCookies from 'vue-cookies';

Vue.prototype.$http = Axios;
const token = localStorage.getItem('token');
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token;
}

Vue.config.productionTip = false;

Vue.use(VueCookies);

/*new Vue({
  router
}).$mount("#app");*/

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

import "../src/api/bootstrap.js"
import "../src/assets/common.css"
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import 'mdb-vue-ui-kit/css/mdb.min.css';
import VueDraggable from "vuedraggable";

Vue.config.productionTip = false;
Vue.use(VueDraggable)

Vue.prototype.$axios = axios;
Vue.prototype.$serverUrl = '//localhost';

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

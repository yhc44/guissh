import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import Element from 'element-ui'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueWait from 'vue-wait'
Vue.use(Vuetify)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VueWait)
Vue.use(Element)
export const E = new Vue()
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  wait: new VueWait(),
  template: '<App/>'
}).$mount('#app')

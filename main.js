import Vue from 'vue'
import App from './App'
import store from './store'
import "./assets/scss/common.scss";
import debounceThrottle from "./common/debounceThrottle"
import conSoleLog from "./common/conSoleLog"
import token from "./common/token"
Vue.config.productionTip = false
Vue.prototype.$store = store

import uView from "uview-ui";
Vue.use(uView);

Vue.prototype.$debounce = debounceThrottle.debounce
Vue.prototype.$throttle = debounceThrottle.throttle
Vue.prototype.$token = token.appCheckToken
Vue.prototype.$log = conSoleLog

const app = new Vue({
	store,
	...App
})
app.$mount()

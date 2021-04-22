import Vue from 'vue'
import App from './App'

import store from './store'
import "./assets/scss/common.scss";
//import conf from './config/conf.js'
Vue.config.productionTip = false
//Vue.prototype.$conf = conf
Vue.prototype.$store = store
// Vue.prototype.$backgroundAudioData = {
// 	playing: false,
// 	playTime: 0,
// 	formatedPlayTime: '00:00:00'
// }
// Vue.prototype.$adpid = "1111111111"

// App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()

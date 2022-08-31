import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vant from 'vant'
import 'vant/lib/index.css'
import router from './router'
import BaiduMap from 'vue-baidu-map'
import Plugin from 'v-fit-columns'
import API from './api/index'

Vue.use(Plugin)
Vue.use(ElementUI)
Vue.use(Vant)
Vue.use(BaiduMap, {
  ak: '6IGo16caaj73O7brasPrt04sOVXK7xi0'
})

Vue.config.productionTip = false
Vue.prototype.$API = API

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

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
import store from './store'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

// const socket = io('ws://127.0.0.1:3000', {
//   autoConnect: false,
//   query: {
//     userID: this.$store.state.user.userinfo.username
//   }
// })
// socket.open()

Vue.use(
  new VueSocketIO({
    // debug: true,
    connection: SocketIO('ws://localhost:3000', {
      autoConnect: false
      // query: {
      //   user: JSON.stringify(store.state.user.userinfo)
      // },
      // store
    })
  })
)

Vue.use(Plugin)
Vue.use(ElementUI)
Vue.use(Vant)
Vue.use(BaiduMap, {
  ak: '6IGo16caaj73O7brasPrt04sOVXK7xi0'
})

Vue.config.productionTip = false
Vue.prototype.$API = API

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import Vuex from 'vuex'
import UserModule from './user/user'
import TeamModule from './team/team'
import ActivityModule from './activity/activity'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user: UserModule,
    team: TeamModule,
    activity: ActivityModule
  }
})

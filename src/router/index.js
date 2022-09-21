import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home/Home.vue'
import Team from '../views/Team/Team.vue'
import Stadium from '../views/Stadium/Stadium.vue'
import User from '../views/User/User.vue'
import CreateTeam from '@/components/team/create.vue'
import UserLogin from '@/components/user/UserLogin.vue'
import UserInfo from '@/components/user/UserInfo.vue'
// import teamJoin from '@/components/team/join.vue'
import UserData from '@/components/user/SetUserData.vue'
import setPassword from '@/components/user/SetPassword.vue'
import createActivity from '@/components/activity/create.vue'
import teamActivity from '@/components/activity/list.vue'
import SetTeamInfo from '@/components/team/SetTeamInfo.vue'
import TeamInfo from '@/components/team/teamCenter.vue'
import { getUserInfo } from '@/api/user'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home, meta: { TabBarShow: true } },
  { path: '/teamList', component: Team, meta: { TabBarShow: true } },
  { path: '/stadium', component: Stadium, meta: { TabBarShow: true } },
  { path: '/user', component: User, meta: { TabBarShow: true } },
  { path: '/team/create', component: CreateTeam, meta: { TabBarShow: false } },
  { path: '/user/login', component: UserLogin, meta: { TabBarShow: false } },
  { path: '/my/userinfo', component: UserInfo, meta: { TabBarShow: false } },
  { path: '/my/update', component: UserData, meta: { TabBarShow: false } },
  { path: '/my/setPassword', component: setPassword, meta: { TabBarShow: false } },
  // { path: '/team/join', component: teamJoin, meta: { TabBarShow: false } },
  { path: '/activity/create', component: createActivity, meta: { TabBarShow: false } },
  { path: '/activity/list', component: teamActivity, meta: { TabBarShow: false } },
  { path: '/team/teamCenter', component: TeamInfo, meta: { TabBarShow: false } },
  { path: '/team/SetTeamInfo', component: SetTeamInfo, meta: { TabBarShow: false } }

]

const router = new VueRouter({
  routes
})

const RouterArr = ['/home', '/teamList', '/stadium', '/user', '/activity/list', '/user/login']
router.beforeEach((to, from, next) => {
  if (!RouterArr.includes(to.path)) {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('token不存在,请先登陆')
      next('/user/login')
      return
    }
    getUserInfo().then(res => {
      if (res.data.status === 200) {
        console.log('用户token验证通过')
        return next()
      }
      console.log(res.data)
      next('/user/login')
    })
  }
  next()
})

export default router

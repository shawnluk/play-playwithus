import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home/Home.vue'
import Team from '../views/Team/Team.vue'
import Stadium from '../views/Stadium/Stadium01.vue'
import User from '../views/User/User.vue'
import CreateTeam from '@/views/CreateTeam/CreateTeam.vue'
import UserLogin from '@/components/user/UserLogin.vue'
import getUserinfo from '@/utils/getUserinfo'
import UserInfo from '@/components/user/UserInfo.vue'
import teamCreate from '@/components/teamAction/teamCreate.vue'
import teamJoin from '@/components/teamAction/teamJoin.vue'
import UserData from '@/components/user/UserData.vue'
import setPassword from '@/components/user/setPassword.vue'
import createTeamAction from '@/components/teamAction/createTeamAction.vue'
import teamActivity from '@/components/teamAction/teamActivity.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home, meta: { TabBarShow: true } },
  { path: '/team', component: Team, meta: { TabBarShow: true } },
  { path: '/stadium', component: Stadium, meta: { TabBarShow: true } },
  { path: '/user', component: User, meta: { TabBarShow: true } },
  { path: '/CreateTeam', component: CreateTeam, meta: { TabBarShow: false } },
  { path: '/user/login', component: UserLogin, meta: { TabBarShow: false } },
  { path: '/my/userinfo', component: UserInfo, meta: { TabBarShow: false } },
  { path: '/team/create', component: teamCreate, meta: { TabBarShow: false } },
  { path: '/team/join', component: teamJoin, meta: { TabBarShow: false } },
  { path: '/my/update', component: UserData, meta: { TabBarShow: false } },
  { path: '/my/setPassword', component: setPassword, meta: { TabBarShow: false } },
  { path: '/team/createTeamAction', component: createTeamAction, meta: { TabBarShow: false } },
  { path: '/team/activity', component: teamActivity, meta: { TabBarShow: false } }

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/my/userinfo') {
    if (from.path === '/user/login') {
      next()
    } else {
      const token = localStorage.getItem('token')
      if (!token) {
        next('/user/login')
      } else {
        const res = getUserinfo()
        res.then(res1 => {
          if (res1.status === 403) {
            alert(JSON.stringify(res1))
            next('/user/login')
          }
          next()
        })
      }
    }
  }
  if (to.path === '/my/setpassword') {
    const token = localStorage.getItem('token')
    if (!token) {
      next('/user/login')
    } else {
      const res = getUserinfo()
      res.then(res1 => {
        if (res1.status === 403) {
          alert(JSON.stringify(res1))
          next('/user/login')
        }
        next()
      })
    }
  }
  next()
})

export default router

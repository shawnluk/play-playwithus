import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home/Home.vue'
import Team from '../views/Team/Team.vue'
import Stadium from '../views/Stadium/Stadium01.vue'
import User from '../views/User/User.vue'
import CreateTeam from '@/components/team/TeamCreate.vue'
import UserLogin from '@/components/user/UserLogin.vue'
import getUserinfo from '@/utils/getUserinfo'
import UserInfo from '@/components/user/UserInfo.vue'
import teamJoin from '@/components/team/TeamJoin.vue'
import UserData from '@/components/user/SetUserData.vue'
import setPassword from '@/components/user/SetPassword.vue'
import createActivity from '@/components/team/CreateActivity.vue'
import teamActivity from '@/components/team/ActivityData.vue'
import SetTeamInfo from '@/components/team/SetTeamInfo.vue'
import TeamInfo from '@/components/team/TeamInfo.vue'

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
  { path: '/team/join', component: teamJoin, meta: { TabBarShow: false } },
  { path: '/team/createActivity', component: createActivity, meta: { TabBarShow: false } },
  { path: '/team/activity', component: teamActivity, meta: { TabBarShow: false } },
  { path: '/team/TeamInfo', component: TeamInfo, meta: { TabBarShow: false } },
  { path: '/team/SetTeamInfo', component: SetTeamInfo, meta: { TabBarShow: false } }

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
  if (from.path === '/user/login') {
    next()
  }
  next()
})

export default router

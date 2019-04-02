import Vue from 'vue'
import Router from 'vue-router'
import DailySnapshot from '@/components/DailySnapshot'

Vue.use(Router)

export default new Router({
  mode: 'history',
  root: '/',
  routes: [
    {
      path: '/',
      redirect: '/post-room'
    },
    {
      path: '/post-room',
      name: 'DailySnapshot',
      component: DailySnapshot
    },
    {
      path: '/new-companies',
      name: 'DailySnapshot',
      component: DailySnapshot
    }
  ]
})

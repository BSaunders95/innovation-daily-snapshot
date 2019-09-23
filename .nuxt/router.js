import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _0b9e9df2 = () => interopDefault(import('../pages/departments/index.vue' /* webpackChunkName: "pages/departments/index" */))
const _6208834f = () => interopDefault(import('../pages/login/index.vue' /* webpackChunkName: "pages/login/index" */))
const _62e6a72e = () => interopDefault(import('../pages/users/index.vue' /* webpackChunkName: "pages/users/index" */))
const _773b82da = () => interopDefault(import('../pages/dayposition/_id.vue' /* webpackChunkName: "pages/dayposition/_id" */))
const _db156da2 = () => interopDefault(import('../pages/departments/_id.vue' /* webpackChunkName: "pages/departments/_id" */))
const _c69ec5d4 = () => interopDefault(import('../pages/users/_id.vue' /* webpackChunkName: "pages/users/_id" */))
const _25563a96 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
      path: "/departments",
      component: _0b9e9df2,
      name: "departments"
    }, {
      path: "/login",
      component: _6208834f,
      name: "login"
    }, {
      path: "/users",
      component: _62e6a72e,
      name: "users"
    }, {
      path: "/dayposition/:id?",
      component: _773b82da,
      name: "dayposition-id"
    }, {
      path: "/departments/:id",
      component: _db156da2,
      name: "departments-id"
    }, {
      path: "/users/:id",
      component: _c69ec5d4,
      name: "users-id"
    }, {
      path: "/",
      component: _25563a96,
      name: "index"
    }],

  fallback: false
}

export function createRouter() {
  return new Router(routerOptions)
}

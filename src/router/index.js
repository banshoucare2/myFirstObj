
import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store'
import { routes } from './routes'
import cookies from "js-cookie";

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  const code = to.query.code
  console.log(`[路由跳转]: ${from.path} => ${to.path}`)
  // console.log('[路由跳转-目标路由]: ', to)
  // console.log('[路由跳转-原始路由]: ', from)
  const title = to.meta.title
  if (title) document.title = title
  if (to.path === '/') {
    if (cookies.get('ge_adminToken')) {
      await store.dispatch('user/login')
      next('/index')
    } else {
      next('/login')  // 未登录则跳转到登录页
    } 
  } else {
    if (to.path === '/login') {
      next()  // 登录页直接next()
    } else {
      if (cookies.get('ge_adminToken')) {  // 如果已登录
        await store.dispatch('user/login')
        next()
      } else {
        next('/login')  // 未登录则跳转到登录页
      }
    } 
  }  
})

router.afterEach(async (to, from, next) => {
  if (to.meta.needWxSignature) {

  }
})

export default router

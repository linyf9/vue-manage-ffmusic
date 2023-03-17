import Vue from 'vue'
import vueRouter from 'vue-router'
import {getToken} from '@/utils/auth.js'
Vue.use(vueRouter)
const router = new vueRouter({
    routes: [
        {
            path: '/',
            component: () => import('../views/Main.vue'),
            redirect: '/home', //路由重定向
            children: [
                {
                    path: 'home',
                    name: 'home',
                    component: () => import('../views/Home.vue'), //路由懒加载
                },
                {
                    path: 'song',
                    name: 'song',
                    component: () => import('../views/Song.vue')
                },
                {
                    path: 'singer',
                    name: 'singer',
                    component: () => import('../views/Singer.vue')
                },
                {
                    path: 'list',
                    name: 'list',
                    component: () => import('../views/List.vue')
                },
                {
                    path: 'user',
                    name: 'user',
                    component: () => import('../views/User.vue')
                },

            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue')
        }

    ],
    // mode:
})

// 前置路由守卫
router.beforeEach((to, from, next) => {
    // 判断token存不存在
    // 如果token不存在，说明当前用户是未登录，应该跳转至登录页
    if (!getToken() && to.name !== 'login') {
       next({name: 'login'}) 
    } else if (getToken() && to.name === 'login') {
        // token存在，说明用户已经登录，此时不能跳回登录页
        next({name: from.name})
    } else {
        next()
    }
})


export default router
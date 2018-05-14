import Vue from 'vue'
import Router from 'vue-router'

import App from '../../src/App'
Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        component: App,
        children: [{
                path: '/',
                redirect: '/login'
            }, {
                path: '/login',
                meta: {
                    title: '登录'
                },
                component: resolve => require(['@/view/login'], resolve)
            },
            {
                path: '/logins',
                meta: {
                    title: '登录'
                },
                component: resolve => require(['@/view/logins'], resolve)
            },
            {
                path: '/step1',
                meta: {
                    title: '第一步'
                },
                component: resolve => require(['@/view/step1'], resolve)
            },
            {
                path: '/step2',
                meta: {
                    title: '第er步'
                },
                component: resolve => require(['@/view/step2'], resolve)
            },
            {
                path: '/step3',
                meta: {
                    title: '第er步'
                },
                component: resolve => require(['@/view/step3'], resolve)
            },
            {
                path: '/step4',
                meta: {
                    title: '第er步'
                },
                component: resolve => require(['@/view/step4'], resolve)
            },
            {
                path: '/step5',
                meta: {
                    title: '第er步'
                },
                component: resolve => require(['@/view/step5'], resolve)
            },
            {
                path: '/stepdtl',
                meta: {
                    title: '详情'
                },
                component: resolve => require(['@/view/stepdtl'], resolve)
            },
            {
                path: '/edit',
                meta: {
                    title: '编辑'
                },
                component: resolve => require(['@/view/edit'], resolve)
            },
            {
                path: '/addArder',
                meta: {
                    title: '头批'
                },
                component: resolve => require(['@/view/addArder'], resolve)
            },
            {
                path: '/addOrder',
                meta: {
                    title: '追单'
                },
                component: resolve => require(['@/view/addOrder'], resolve)
            },
            {
                path: '/addDtl',
                meta: {
                    title: '详情'
                },
                component: resolve => require(['@/view/addDtl'], resolve)
            }
        ]
    }],
})
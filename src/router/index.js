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
                redirect: '/oly/login'
            }, {
                path: '/login',
                meta: {
                    title: '生产跟进'
                },
                component: resolve => require(['@/view/login'], resolve)
            }, {
                path: '/oly/login',
                meta: {
                    title: '欧林雅'
                },
                component: resolve => require(['@/view/oly/login'], resolve)
            },
            {
                path: '/logins',
                meta: {
                    title: '数据汇总'
                },
                component: resolve => require(['@/view/logins'], resolve)
            },
            {
                path: '/step1',
                meta: {
                    title: '生产跟进'
                },
                component: resolve => require(['@/view/step1'], resolve)
            },
            {
                path: '/step2',
                meta: {
                    title: '生产跟进'
                },
                component: resolve => require(['@/view/step2'], resolve)
            },
            {
                path: '/step3',
                meta: {
                    title: '生产跟进'
                },
                component: resolve => require(['@/view/step3'], resolve)
            },
            {
                path: '/step4',
                meta: {
                    title: '生产跟进'
                },
                component: resolve => require(['@/view/step4'], resolve)
            },
            {
                path: '/step5',
                meta: {
                    title: '生产跟进'
                },
                component: resolve => require(['@/view/step5'], resolve)
            },
            {
                path: '/stepdtl',
                meta: {
                    title: '生产跟进'
                },
                component: resolve => require(['@/view/stepdtl'], resolve)
            },
            {
                path: '/edit',
                meta: {
                    title: '生产跟进'
                },
                component: resolve => require(['@/view/edit'], resolve)
            },
            {
                path: '/addArder',
                meta: {
                    title: '数据汇总'
                },
                component: resolve => require(['@/view/addArder'], resolve)
            },
            {
                path: '/addOrder',
                meta: {
                    title: '数据汇总'
                },
                component: resolve => require(['@/view/addOrder'], resolve)
            },
            {
                path: '/addDtl',
                meta: {
                    title: '数据汇总'
                },
                component: resolve => require(['@/view/addDtl'], resolve)
            },
            { //下面是 欧莱雅项目的路由
                path: '/oly/stock',
                meta: {
                    title: '欧林雅'
                },
                component: resolve => require(['@/view/oly/stock'], resolve)
            }, {
                path: '/oly/member',
                meta: {
                    title: '欧林雅'
                },
                component: resolve => require(['@/view/oly/member'], resolve)
            }, {
                path: '/oly/cost',
                meta: {
                    title: '欧林雅'
                },
                component: resolve => require(['@/view/oly/cost'], resolve)
            }, {
                path: '/oly/sale',
                meta: {
                    title: '欧林雅'
                },
                component: resolve => require(['@/view/oly/sale'], resolve)
            }
        ]
    }],
})
import {createRouter, createWebHistory} from 'vue-router'
import Manage from "@/views/Manage";
import User from "@/views/User";
import Home from "@/views/Home";
import store from "@/store";

const routes = [
    {
        path: '/',
        name: 'Manage',
        component: Manage,
        redirect: '/home',
        children: [
            {
                path: 'user',
                name: 'User',
                component: User,
                meta: {
                    breadcrumb: [
                        {
                            name: '用户管理',
                            path: '/user'
                        }
                    ]
                }
            },
            {
                path: 'home',
                name: 'Home',
                component: Home,
                meta: {
                    breadcrumb: [
                        {
                            name: '首页',
                            path: '/user'
                        }
                    ]
                }
            },


        ]
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
    let tags = []
    to.matched.forEach(item => {
        if (item.meta.breadcrumb) {
            tags = tags.concat(item.meta.breadcrumb)
        }
    })
    store.commit('setBreadcrumbList', tags)
    next()
})
export default router

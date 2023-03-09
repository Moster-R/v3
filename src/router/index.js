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
                meta: {name: '用户管理'}
            },
            {
                path: 'home',
                name: 'Home',
                component: Home,
                meta: {name: '主页'}
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
    const breadcrumb = [];
    to.matched.forEach(record => {
        if (record.meta.name ){
            breadcrumb.push({
                text:record.meta.name,
                to: record.path
            })
        }
    })
    if (to.meta.name){
        store.commit('addTags', to);
    }
   store.commit('setBreadcrumbList',breadcrumb)
    next()
})

export default router

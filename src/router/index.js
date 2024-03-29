import {createRouter, createWebHistory} from 'vue-router'
import Manage from "@/views/Manage";
import User from "@/views/User";
import Home from "@/views/Home";
import store from "@/store";
import Login from "@/views/Login";
import Register from "@/views/Register";
import Person from "@/views/Person";
import File from "@/views/File";

const routes = [
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: {title: '登录', noCache: true}
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
        meta: {title: '注册', noCache: true}
    },
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
            {
                path: "person",
                name: "Person",
                component: Person,
                meta: {name: '个人信息', noCache: true}
            },
            {
                path: "file",
                name: "file",
                component:File,
                meta: {name: '文件管理', noCache: true}
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
        // 面包屑路由
        if (record.meta.name) {
            breadcrumb.push({
                text: record.meta.name,
                to: record.path
            })
        }
    })
    store.commit('setBreadcrumbList', breadcrumb)
    // 标签路由添加
    if (to.meta.name) {
        store.commit('addTags', to);
    }
    if (to.name !== 'Login' && to.name !== 'Register' && !sessionStorage.getItem('token')) { // 判断用户是否登录
        next({name: 'Login'})
    } else {
        next()
    }

})

export default router

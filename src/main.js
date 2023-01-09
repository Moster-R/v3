import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'  // 引入ElementPlus组件
import 'element-plus/theme-chalk/index.css'
import zhCn from "element-plus/es/locale/lang/zh-cn";  //国际化
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // 引入icon
import './assets/css/gloable.css' //引入自定义全局css文件(覆盖element-plus自带的css)

const app = createApp(App)
app.use(store).use(router).use(ElementPlus,{locale: zhCn,}).mount('#app')

// 全局设置element-icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


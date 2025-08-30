import { createApp } from 'vue' 
import './assets/tailwind.css'
import App from './App.vue'
import router from './router'
import clickOutside from './directives/clickOutside'

// 引入 Arco Design
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.less'
import './assets/arco-theme.less'

// 引入 PrimeVue
import PrimeVue from 'primevue/config'
import Tree from 'primevue/tree'

// 引入 Socket 管理器
import socketManager from './socket'

const app = createApp(App)

// 注册全局属性
app.config.globalProperties.$socket = socketManager

// 提供全局注入
app.provide('socket', socketManager)

app.use(router)
app.use(ArcoVue)
app.use(PrimeVue)
app.component('Tree', Tree)
app.directive('click-outside', clickOutside)
app.mount('#app')

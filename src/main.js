import Vue from 'vue'
import App from './App.vue'
// 完整引入element-ui
import ElementUI from 'element-ui'; 
import 'element-ui/lib/theme-chalk/index.css';
// 导入路由
import router from './router'
// 导入store
import store from './store';
// 导入所有接口，并挂载到Vue原型上
import api from './api'

Vue.prototype.$api = api

Vue.config.productionTip = false

// 注册element-ui
Vue.use(ElementUI);

new Vue({
    // 挂载路由
    router,
    // 挂载仓库
    store,
    render: h => h(App),
}).$mount('#app')

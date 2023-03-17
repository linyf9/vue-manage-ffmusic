import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import tab from './tab'
import user from './user'
import singer from './singer'
export default new Vuex.Store({
    modules: {
        tab,
        user,
        singer
    }
})
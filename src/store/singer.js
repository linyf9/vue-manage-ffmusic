// import '' from '../api'

export default {
    namespaced: true,
    state: {
        singer_avatar:''
    },
    mutations: {
        updateSingerA(state, file) {
            state.singer_avatar = file
        }
    },
    actions: {},
    getters: {}
}
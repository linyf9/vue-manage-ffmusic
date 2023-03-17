import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
    return {
        token: getToken(),
        userInfo: {},
        loginTime: localStorage.getItem('loginTime') || '',
        loginAddress: localStorage.getItem('loginAddress') || '',
    }
}

const state = getDefaultState()

const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
    // 保存token
    SET_TOKEN(state, token){
        state.token = token
    },
    // 保存用户信息
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo
    },

    // 设置登录时间
    SETLOGINTIME(state, time) {
        state.loginTime = time
        // 存到本地
        localStorage.setItem('loginTime', time)
    },
    // 设置登录地点
    SETLOGINADDRESS(state, address) {
        state.loginAddress = address
        // 存到本地
        localStorage.setItem('loginAddress', address)
    }

    
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
}

const actions = {
    // user login
    // async login({ commit }, userInfo) {
    //     const { user_name, password } = userInfo
    //     let res = await login({ user_name: user_name.trim(), password: password })
    //     console.log(res);
    //     if (res.code === 200) {
    //         commit('SET_TOKEN', data.token)
    //         setToken(data.token)
    //         return Promise.resolve('Ok')
    //     } else {
    //         return new Promise(new Error('file'))
    //     }
        
    
    // },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


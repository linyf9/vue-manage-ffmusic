import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// 引入进度条
import nprogress from 'nprogress'
// 进度条的 start方法：代表进度条开始动，done方法：代表进度条结束
// 引入进度条样式
import "nprogress/nprogress.css"

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url   process.env.VUE_APP_BASE_API
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截器，token字段
service.interceptors.request.use(
    config => {
        console.log(config);
        if (getToken()) {
        config.headers['token'] = getToken()
        }
    // 请求刚要开始时，进度条开始动
    nprogress.start();
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
    response => {
        // 注意res为response
        const res = response.data
        console.log(res,'9999');

        // if the custom code is not 20000, it is judged as an error.
        // 响应失败
        if (res.code !== 200) {
            // console.log(11111);
            nprogress.done();
            Message({
                message: res.message || 'Error',
                type: 'error',
                duration: 3 * 1000
            })

            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === '10101') {
                // to re-login
                MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
                    confirmButtonText: 'Re-Login',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                })
            }
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            // 响应成功
            // 进度条结束
            nprogress.done();
            return res
        }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

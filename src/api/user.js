import request from '@/utils/request'

// 1. 管理员登录的接口，user_name：'admin',  password：'666666'
export const reqLogin = (data) => request({
    url: '/user/login',
    method: 'post',
    data
})
// 原本应该就是通过登录后的token来获取用户信息，但是后台接口没写好，直接在登录的时候就有用户信息和token了
// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}


// 2. 获取所有用户信息
export const reqGetUsers = (page,limit) => request({
    url: `/user/all?offset=${page}&limit=${limit}`,
    method: 'GET'
})
// 3. 添加用户 POST，请求参数：user_name  nickname
export const reqAddUser = (user_name,nickname) => {
    return request({
    url: `/user/front/register?user_name=${user_name}&nickname=${nickname}`,
    method: 'POST'
})
}
// 4. 根据id 修改用户信息 POST，请求参数：user_id  user_name  nickname
export const reqUpdateUser = (user_id,user_name,nickname) => request({
    url: `/user/admin/update?user_id=${user_id}&user_name=${user_name}&nickname=${nickname}`,
    method: 'POST'
})
// 5. 删除用户 DELETE  user_id   /user/admin/delete/:user_id
export const reqDeleteUser = (user_id) => request({
    url: `/user/admin/delete/${user_id}`,
    method: 'DELETE',
})

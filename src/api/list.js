import request from '@/utils/request'
// 1. 获取所有歌单的数据
export const reqGetList = (page,limit) => request({
    url: `/list?offset=${page}&limit=${limit}`,
    method: 'GET'
})
// 2. 添加歌单 POST，请求参数：list_title  list_details  list_imgpath
export const reqAddList = (formData) => {
    return request({
    url: '/list/admin/add',
    method: 'POST',
    headers: {
        'Content-Type':'multipart/form-data'
    },
    data:formData
})
}
// 3. 修改歌单 PUT，请求参数：list_id  list_title  list_details  list_imgpath
export const reqUpdateList = (formData) => request({
    url: '/list/admin/update',
    method: 'PUT',
    headers: {
        'Content-Type':'multipart/form-data'
    },
    data:formData
})
// 4. 删除歌单 DELETE  list_id   /list/admin/delete/:list_id
export const reqDeleteList = (list_id) => request({
    url: `/list/admin/delete/${list_id}`,
    method: 'DELETE',
})
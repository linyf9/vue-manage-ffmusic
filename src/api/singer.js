import request from '@/utils/request'
// 1. 获取所有歌手的数据
export const reqGetSingers = (page,limit) => request({
    url: `/singer?offset=${page}&limit=${limit}`,
    method: 'GET'
})
// 2. 添加歌手 post，请求参数：singer_name  singer_details  singer_avatar
export const reqAddSinger = (formData) => {
    // console.log(formData);
    return request({
    url: '/singer/admin/add',
    method: 'POST',
    headers: {
        'Content-Type':'multipart/form-data'
    },
    data:formData
})
}
// 3. 修改歌手 put，请求参数：singer_id  singer_name  singer_details  singer_avatar
export const reqUpdateSinger = (formData) => request({
    url: '/singer/admin/update',
    method: 'PUT',
    headers: {
        'Content-Type':'multipart/form-data'
    },
    data:formData
})
// 4. 删除歌手
export const reqDeleteSinger = (singer_id) => request({
    url: `/singer/admin/${singer_id}`,
    method: 'DELETE',
})
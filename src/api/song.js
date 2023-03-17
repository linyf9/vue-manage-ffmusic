import request from '@/utils/request'

// 1. 获取所有歌曲的数据
export const reqGetSongs = (page,limit) => request({
    url: `/song/all?offset=${page}&limit=${limit}`,
    method: 'GET'
})

// 2. 添加歌曲 POST，请求参数：
export const reqAddSong = (formData) => {
    return request({
    url: '/song/admin/upload',
    method: 'POST',
    headers: {
        'Content-Type':'multipart/form-data'
    },
    data:formData
})
}
// 3. 修改歌曲 PUT，请求参数：song_id, song_songname, song_rank, song_listid, song_singerid
export const reqUpdateSong = (data) => request({
    url: '/song/admin/update',
    method: 'PUT',
    headers: {
        'Content-Type':'multipart/form-data'
    },
    data
})
// 4. 删除歌曲 DELETE  song_id   /song/admin/delete/:list_id
export const reqDeleteSong = (list_id) => request({
    url: `/song/admin/delete/${list_id}`,
    method: 'DELETE',
})

// 5. 获取所有歌手名称及id
export const reqGetAllSingers = () => request({
    url: `/singer/all/name/id`,
    method: 'GET',
})

// 6. 获取所有歌单标题及id
export const reqGetAllLists = () => request({
    url: `/list/all/name/id`,
    method: 'GET',
})
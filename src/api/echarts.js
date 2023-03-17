import request from '@/utils/request'
// 1. 获取柱状图1的数据
export const reqGetBarData = () => request({
    url: `/admin/amount`,
    method: 'GET'
})
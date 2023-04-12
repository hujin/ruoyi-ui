import request from '@/utils/request'


// 
export function getDeviceList(params) {
    return request({
      url: '/slp/management/list',
      method: 'get',
      params
    })
}


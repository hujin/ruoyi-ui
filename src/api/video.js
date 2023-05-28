import request from '@/utils/request'

export function getOverviewInfo(){
  return request({
    url:'/slp/slp/monitor/video/getOverviewInfo',
    method:'get'
  })
}

export function getDeviceList(params) {
    return request({
      url: '/slp/slp/monitor/video/list',
      method: 'get',
      params
    })
}

export function getDeviceDetail(id){
  return request({
      url:`/slp/slp/monitor/video/${id}`,
      method: 'get',
  })
}


export function editDevice(data){
  return request({
      url:'/slp/slp/monitor/video',
      data,
      method: 'put'
  })
}

export function addDevice(data){
  return request({
      url:'/slp/slp/monitor/video',
      data,
      method:'post'
  })
}

export function deleteDevice(ids){
  return request({
      url:`/slp/slp/monitor/video/${ids}`,
      method:'delete'
  })
}

export function exportDevice(data){
  return request({
      url:`/slp/slp/monitor/video/export`,
      data,
      method:'post'
  })
}

export function getRoadRelation(){
  return request({
      url:`/slp/slp/monitor/video/getMonitorManagementInfo`,
      method:'get'
  })
}

export function getRealTimeUrl(params){
  return request({
    url:`/slp/slp/monitor/video/getRealTimeUrl/${params.id}`,
    method:'get'
  })
}

export function getPlayBackVideo(params){
  return request({
    url:'/slp/slp/monitor/video/getPlayBackVideo',
    params,
    method:'get'
  })
}


export function getOfflineTime(){
  return request({
      url:'/slp/slp/monitor/video/getOfflineTime',
      method:'get'
  })
}

export function setOfflineTime(data){
  return request({
      url:'/slp/slp/monitor/video/setOfflineTime',
      data,
      method:'post'
  })
}
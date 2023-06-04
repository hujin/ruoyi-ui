import request from '@/utils/request'

export function getOverviewInfo(params){
  return request({
      url:'/slp/slp/manhole/cover/getOverviewInfo',
      method:'get',
      params
  })
}

export function getMonitorDetailInMap(id){
  return request({
      url:`/slp/slp/manhole/cover/getMonitorInfoById/${id}`,
      method:'get'
  })
}

export function getDeviceList(params) {
    return request({
      url: '/slp/slp/manhole/cover/list',
      method: 'get',
      params
    })
}

export function getDeviceDetail(id){
  return request({
      url:`/slp/slp/manhole/cover/${id}`,
      method: 'get',
  })
}

export function editDevice(data){
  return request({
      url:'/slp/slp/manhole/cover',
      data,
      method: 'put'
  })
}

export function addDevice(data){
  return request({
      url:'/slp/slp/manhole/cover',
      data,
      method:'post'
  })
}

export function deleteDevice(ids){
  return request({
      url:`/slp/slp/manhole/cover/${ids}`,
      method:'delete'
  })
}

export function exportDevice(data){
  return request({
      url:`/slp/slp/manhole/cover/export`,
      data,
      method:'post'
  })
}

export function setDefences(data){
  return request({
      url:`/slp/slp/manhole/setDefences`,
      data,
      method:'post'
  })
}

export function getDeviceRoadRelation(){
  return request({
      url:`/slp/slp/manhole/getDeviceRoadRelation`,
      data,
      method:'post'
  })
}

export function getRoadRelation(){
  return request({
      url:`/slp/slp/manhole/cover/getDeviceRoadRelation`,
      method:'get'
  })
}

export function getMonitorDetail(id){
  return request({
      url:`/slp/slp/manhole/cover/reportedData/getOverview`,
      method:'get',
      params:{
        manholeCoverId:id
      }
  })
}

export function getMonitorList(params) {
  return request({
    url:`/slp/slp/manhole/cover/reportedData/list`,
    method:'get',
    params
})
}

export function getDeviceWarningList(params) {
  return request({
    url: '/slp/slp/manhole/cover/warning/list',
    method: 'get',
    params
  })
}

export function getDeviceWarningCount(params) {
  return request({
    url: '/slp/slp/manhole/cover/warning/count',
    method: 'get',
    params
  })
}

export function removeWarning(ids){
  console.log(ids)
  return request({
    url:`/slp/slp/manhole/cover/warning/${ids}`,
    method:'delete'
  })
}

export function getDefences(){
  return request({
    url: '/slp/slp/manhole/cover/defences/count',
    method: 'get',
  })
}

export function setCoverDefences(params){
  return request({
    url: '/slp/slp/manhole/cover/setDefences',
    method: 'get',
    params
  })
}

export function getCoverLogList(params){
  return request({
    url: '/slp/slp/manhole/cover/defences/list',
    params,
    method:'get'
  })
}

export function removeLog(ids){
  return request({
    url:`/slp/slp/manhole/cover/defences/${ids}`,
    method:'delete'
  })
}

export function getRuleList(){
  return request({
    url:`slp/slp/manhole/cover/rule/list`
  })
}

export function getRuleDetail(id){
  return request({
    url:`slp/slp/manhole/cover/rule/${id}`
  })
}

export function editRule(data){
  return request({
      url:'/slp/slp/manhole/cover/rule',
      data,
      method: 'put'
  })
}

export function addRule(data){
  return request({
      url:'/slp/slp/manhole/cover/rule',
      data,
      method:'post'
  })
}


export function removeRule(ids){
  return request({
    url:`/slp/slp/manhole/cover/rule/${ids}`,
    method:'delete'
  })
}

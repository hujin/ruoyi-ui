import request from '@/utils/request'

export function getOverviewInfo(){
    return request({
        url:'/slp/slp/management/getOverviewInfo',
        method:'get'
    })
}

export function getMonitorDetailInMap(id){
    return request({
        url:`/slp/slp/management/getMonitorInfoById/${id}`,
        method:'get'
    })
}

// 
export function getDeviceList(params) {
    return request({
      url: '/slp/slp/management/list',
      method: 'get',
      params
    })
}

export function getDeviceDetail(id){
    return request({
        url:`/slp/slp/management/${id}`,
        method: 'get',
    })
}

export function editDevice(data){
    return request({
        url:'/slp/slp/management',
        data,
        method: 'put'
    })
}

export function addDevice(data){
    return request({
        url:'/slp/slp/management',
        data,
        method:'post'
    })
}

export function deleteDevice(ids){
    return request({
        url:`/slp/slp/management/${ids}`,
        method:'delete'
    })
}

export function exportDevice(data){
    return request({
        url:`/slp/slp/management/export`,
        data,
        method:'post'
    })
}

export function getRoadRelation(){
    return request({
        url:`/slp/slp/management/getStationRoadRelation`,
        method:'get'
    })
}

export function getReleaseList(params){
    return request({
        url:'/slp/slp/release/list',
        params,
        method:'get'
    })
}

export function addRelease(data){
    return request({
        url:'/slp/slp/release',
        data,
        method:'post'
    })
}

export function editRelease(data){
    return request({
        url:'/slp/slp/release',
        data,
        method:'put'
    })
}

export function getRelease(id){
    return request({
        url:`/slp/slp/release/${id}`,
        method:'get'
    })
}

export function deleteRelease(ids){
    return request({
        url:`/slp/slp/slp/release/remove/${ids}`,
        method:'delete'
    })
}

export function exportRelease(data){
    return request({
        url:'/slp/slp/release/export',
        data,
        method:'post'
    })
}

export function getMonitorDetail(id){
    return request({
        url:`/slp/slp/monitor/id/${id}`,
        method:'get'
    })
}

export function getMonitorStationDetail(id){
    return request({
        url:`/slp/slp/monitor/station/${id}`,
        method:'get'
    })
}

export function getMonitorList(params){
    return request({
        url:'/slp/slp/monitor/list',
        params,
        method:'get'
    })
}

export function exportMonitor(data){
    return request({
        url:`/slp/slp/monitor/export`,
        data,
        method:'post'
    })
}

export function getHourData(params){
    return request({
        url:`/slp/slp/monitor/findHourList`,
        params,
        method:'get'
    })
}

export function getOfflineTime(){
    return request({
        url:'/slp/slp/management/getOfflineTime',
        method:'get'
    })
}

export function setOfflineTime(data){
    return request({
        url:'/slp/slp/management/setOfflineTime',
        data,
        method:'post'
    })
}
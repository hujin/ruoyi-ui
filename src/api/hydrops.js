import request from '@/utils/request'

export function getOverviewInfo(params){
    return request({
      url:'/slp/slp/ponding/monitor/getOverViewInfo',
      method:'get',
      params
    })
}

export function getSlpPondingReportedDataBase(params){
    return request({
        url:'/slp/slp/ponding/monitor/getSlpPondingReportedDataBase',
        method:'get',
        params
    })
}

export function getPondingWarningWeekStat(params){
    return request({
        url:'/slp/slp/ponding/warning/getPondingWarningWeekStat',
        params,
        method:'get'
    })
}

export function getWarningProportionVo(){
    return request({
        url:'/slp/slp/ponding/warning/getWarningProportionVo',
        method:'get'
    })
}


export function getDeviceInfoById(id){
    return request({
        url:`/slp/slp/ponding/monitor/getDeviceInfoById/${id}`,
        method:'get'
    })
}

export function getDeviceList(params) {
    return request({
      url: '/slp/slp/ponding/monitor/list',
      method: 'get',
      params
    })
}

export function getDeviceDetail(id){
    return request({
        url:`/slp/slp/ponding/monitor/${id}`,
        method: 'get',
    })
  }
  
  export function editDevice(data){
    return request({
        url:'/slp/slp/ponding/monitor',
        data,
        method: 'put'
    })
  }
  
  export function addDevice(data){
    return request({
        url:'/slp/slp/ponding/monitor',
        data,
        method:'post'
    })
  }
  
  export function deleteDevice(ids){
    return request({
        url:`/slp/slp/ponding/monitor/${ids}`,
        method:'delete'
    })
  }
  
  export function exportDevice(data){
    return request({
        url:`/slp/slp/ponding/monitor/export`,
        data,
        method:'post'
    })
  }
    
export function getRoadRelation(){
    return request({
        url:`/slp/slp/ponding/monitor/getRoadRelation`,
        method:'get'
    })
}

export function getRealTimeOverview(params){
    return request({
        url:'/slp/slp/ponding/reportData/getRealTimeOverview',
        params,
        method:'get'
    })
}

export function getLastReportTime(params){
    return request({
        url:'/slp/slp/ponding/reportData/getLastReportTime',
        params,
        method:'get'
    })
}

export function getPondingMaxHistory(params){
    return request({
        url:'/slp/slp/ponding/reportData/getPondingMaxHistory',
        params,
        method:'get'
    })
}

export function getHistoryListPaged(params){
    return request({
        url:'/slp/slp/ponding/reportData/getHistoryListPaged',
        params,
        method:'get'
    })
}

export function getPondingOverviewWithCompare(params){
    return request({
        url:'/slp/slp/ponding/reportData/getPondingOverviewWithCompare',
        params,
        method:'get'
    })
}

export function getPondingStat(params){
    return request({
        url:'/slp/slp/ponding/reportData/getPondingStat',
        params,
        method:'get'
    })
}

export function pondingForecastVo(params){
    return request({
        url:'/slp/slp/ponding/reportData/pondingForecastVo',
        params,
        method:'get'
    })
}


export function getWarningStatYoy(params){
    return request({
        url:'/slp/slp/ponding/reportData/getWarningStatYoy',
        params,
        method:'get'
    })
}


export function getOfflineTime(){
    return request({
        url:'/slp/slp/ponding/monitor/getOfflineTime',
        method:'get'
    })
  }
  
export function setOfflineTime(data){
    return request({
        url:'/slp/slp/ponding/monitor/setOfflineTime',
        data,
        method:'post'
    })
}

export function getRuleList(params){
    return request({
        url:'/slp/slp/ponding/rule/list',
        params,
        method:'get'
    })
}

export function getRuleDetail(id){
    return request({
        url:`/slp/slp/ponding/rule/${id}`,
        method:'get'
    })
}

export function editRule(data){
    return request({
        url:`/slp/slp/ponding/rule`,
        method:'put',
        data
    })
}

export function saveRule(data){
    return request({
        url:`/slp/slp/ponding/rule`,
        method:'post',
        data
    })
}

export function deleteRule(ids){
    return request({
        url:`/slp/slp/ponding/rule/${ids}`,
        method:'delete'
    })
}

export function getWarningLevelList(params){
    return request({
        url:'/slp/slp/warning/level/config/list',
        params,
        method:'get'
    })
}

export function getWarningLevelDetail(id){
    return request({
        url:`/slp/slp/warning/level/config/${id}`,
        method:'get'
    })
}

export function editWarningLevel(data){
    return request({
        url:`/slp/slp/warning/level/config`,
        method:'put',
        data
    })
}

export function saveWarningLevel(data){
    return request({
        url:`/slp/slp/warning/level/config`,
        method:'post',
        data
    })
}

export function deleteWarningLevel(ids){
    return request({
        url:`/slp/slp/warning/level/config/${ids}`,
        method:'delete'
    })
}

export function getWarningList(params){
    return request({
        url:'/slp/slp/ponding/warning/list',
        params,
        method:'get'
    })
}

export function getWarningDetail(params){
    return request({
        url:`/slp/slp/ponding/warning/${params.id}`,
        method:'get'
    })
}

export function getWarningHandleList(params){
    return request({
        url:'/slp/slp/ponding/warning/handledList',
        params,
        method:'get'
    })
}
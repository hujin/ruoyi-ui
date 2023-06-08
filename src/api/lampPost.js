import request from '@/utils/request'

export function getOverviewInfo(params){
    return request({
        url:'/slp/slp/pole/getOverViewInfo',
        method:'get',
        params
    })
}

export function getDeviceList(params) {
    return request({
      url: '/slp/slp/pole/listAndSub',
      method: 'get',
      params
    })
}


export function getDeviceDetail(id){
    return request({
        url:`/slp/slp/pole/${id}`,
        method: 'get',
    })
}
  
export function editDevice(data){
    return request({
        url:'/slp/slp/pole',
        data,
        method: 'put'
    })
}
  
export function addDevice(data){
    return request({
        url:'/slp/slp/pole',
        data,
        method:'post'
    })
}
  
export function deleteDevice(ids){
    return request({
        url:`/slp/slp/pole/${ids}`,
        method:'delete'
    })
}
  
export function getPoleMountingInfo(params){
    return request({
        url:`/slp/slp/pole/device/getPoleMountingInfo`,
        method:'get',
        params
    })
}

export function getDeviceMounting(params){
    return request({
        url:`/slp/slp/pole/device/getDeviceMounting`,
        method:'get',
        params
    })
}

export function getDeviceCount(params){
    return request({
        url:`/slp/slp/pole/device/getDeviceCount`,
        method:'get',
        params
    })
}

export function getDeviceEnableList(params){
    return request({
        url:`/slp/slp/pole/device/getDeviceEnableList`,
        method:'get',
        params
    })
}

export function getCompanyUse(params){
    return request({
        url:`/slp/slp/pole/device/getCompanyUse`,
        method:'get',
        params
    })
}

export function getMyAuditListPaged(params){
    return request({
        url:`/slp/slp/approval/getMyAuditListPaged`,
        method:'get',
        params
    })
}

export function getMyApplyList(params){
    return request({
        url:`/slp/slp/approval/getMyApplyListPaged`,
        method:'get',
        params
    })
}

export function getApplyDetail(params){
    return request({
        url:`/slp/slp/approval/getDetail`,
        method:'get',
        params
    })
}

export function submitApply(data){
    return request({
        url:`/slp/slp/approval/submitApply`,
        data,
        method:'post'
    })
}

export function createWorkOrder(data){
    return request({
        url:`/slp/slp/approval/createWorkOrder`,
        data,
        method:'post'
    })
}

export function submitAudit(data){
    return request({
        url:`/slp/slp/approval/audit`,
        data,
        method:'post'
    })
}

export function submitSecondAudit(data){
    return request({
        url:`/slp/slp/approval/secondAudit`,
        data,
        method:'post'
    })
}

export function getMyWorkOrderListPaged(params){
    return request({
        url:`/slp/slp/approval/getMyWorkOrderListPaged`,
        method:'get',
        params
    })
}

export function deleteApply(ids){
    return request({
        url:`/slp/slp/approval/${ids}`,
        method:'delete'
    })
}

export function submitHandleResult(data){
    return request({
        url:`/slp/slp/approval/submitHandleResult`,
        data,
        method:'post'
    })
}

export function submitCheckHandleResult(data){
    return request({
        url:`/slp/slp/approval/submitCheckHandleResult`,
        data,
        method:'post'
    })
}

export function getDeptOverview(params){
    return request({
        url:`/slp/slp/approval/report/getDeptOverview`,
        params,
        method:'get'
    })
}

export function getDeptCreateStat(params){
    return request({
        url:`/slp/slp/approval/report/getDeptCreateStat`,
        params,
        method:'get'
    })
}

export function getDeptApplyPropStat(params){
    return request({
        url:`/slp/slp/approval/report/getDeptApplyPropStat`,
        params,
        method:'get'
    })
}

export function getDeptData(params){
    return request({
        url:`/slp/slp/approval/report/getDeptData`,
        params,
        method:'get'
    })
}

export function getDeptApplyListPaged(params){
    return request({
        url:`/slp/slp/approval/report/getDeptApplyListPaged`,
        params,
        method:'get'
    })
}

export function getDeviceUseStatOverview(){
    return request({
        url:`/slp/slp/approval/report/getDeviceUseStatOverview`,
        method:'get'
    })
}

export function getWorkOrderStatOverview(){
    return request({
        url:`/slp/slp/approval/report/getWorkOrderStatOverview`,
        method:'get'
    })
}

export function getWorkOrderCountStat(params){
    return request({
        url:`/slp/slp/approval/report/getWorkOrderCountStat`,
        method:'get',
        params
    })
}

export function getConserveApplyList(params){
    return request({
        url:`/slp/slp/pole/report/list`,
        method:'get',
        params
    })
}

export function addComserveApply(data){
    return request({
        url:`/slp/slp/pole/report`,
        data,
        method:'post'
    })
}

export function deleteComserveApply(ids){
    return request({
        url:`/slp/slp/pole/report/${ids}`,
        method:'delete'
    })
}

export function getConservePlanList(params){
    return request({
        url:`/slp/slp/plan/list`,
        method:'get',
        params
    })
}


export function addPlan(data){
    return request({
        url:`/slp/slp/plan`,
        data,
        method:'post'
    })
}

export function editPlan(data){
    return request({
        url:`/slp/slp/plan`,
        data,
        method:'put'
    })
}

export function getPlanDetail(id){
    return request({
        url:`/slp/slp/plan/${id}`,
        method:'get',
    })
}

export function deletePlan(ids){
    return request({
        url:`/slp/slp/plan/${ids}`,
        method:'delete'
    })
}



export function getContentList(params){
    return request({
        url:`/slp/slp/content/list`,
        method:'get',
        params
    })
}


export function addContent(data){
    return request({
        url:`/slp/slp/content`,
        data,
        method:'post'
    })
}

export function editContent(data){
    return request({
        url:`/slp/slp/content`,
        data,
        method:'put'
    })
}

export function getContent(id){
    return request({
        url:`/slp/slp/content/${id}`,
        method:'get',
    })
}

export function deleteContent(ids){
    return request({
        url:`/slp/slp/content/${ids}`,
        method:'delete'
    })
}

export function getDeptUserStatOverviewVo(){
    return request({
        url:`/slp/slp/inspection/stat/getDeptUserStatOverviewVo`,
        method:'get'
    })
}

export function getUserCreateStat(params){
    return request({
        url:`/slp/slp/inspection/stat/getUserCreateStat`,
        params,
        method:'get'
    })
}

export function getReportTimeAndContent(params){
    return request({
        url:`/slp/slp/inspection/report/getReportTimeAndContent`,
        params,
        method:'get'
    })
}

export function getMountingAnalysis(){
    return request({
        url:`/slp/slp/inspection/report/getMountingAnalysis`,
        method:'get'
    })
}

export function getAlarmList(params){
    return request({
        url:`/slp/slp/pole/warning/list`,
        method:'get',
        params
    })
}

export function getAlarmDetail(id){
    return request({
        url:`/slp/slp/pole/warning/${id}`,
        method:'get',
    })
}

export function addAlarm(data){
    return request({
        url:`/slp/slp/pole/warning`,
        method:'post',
        data
    })
}

export function submitAlarmHandleResult(data){
    return request({
        url:`/slp/slp/pole/warning/submitHandleResult`,
        method:'post',
        data
    })
}



export function alarmCreateWorkOrder(data){
    return request({
        url:`/slp/slp/pole/warning/createWorkOrder`,
        method:'post',
        data
    })
}

export function batchAlarmHandleResult(data){
    return request({
        url:`/slp/slp/pole/warning/batchUpdate`,
        method:'post',
        data
    })
}

export function deleteAlarm(ids){
    return request({
        url:`/slp/slp/pole/warning/${ids}`,
        method:'delete'
    })
}

export function getAlarmHistoryDashboard(params){
    return request({
        url:`/slp/slp/pole/warning/dashboard`,
        method:'get',
        params
    })
}

export function getAlarmHistoryList(params){
    return request({
        url:`/slp/slp/pole/warning/getList`,
        method:'get',
        params
    })
}
import request from '@/utils/request'

export function getOverviewInfo(){
    return request({
        url:'/slp/slp/pole/getOverViewInfo',
        method:'get'
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
        url:`/slp/slp/pole/report/add`,
        data,
        method:'post'
    })
}
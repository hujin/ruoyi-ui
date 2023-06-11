<template>
    <div class="app-container my-order" style="background:#eee;height:calc(100vh - 50px)">
        <div class="h104">
            <el-form :model="queryParams" size="small" :inline="true">
                <el-form-item label="状态" prop="statusCode">
                    <el-select v-model="queryParams.statusCode" placeholder="请选择状态" clearable>
                        <el-option
                            v-for="dict in dict.type.sys_audit_status"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="时间" prop="time">
                    <el-date-picker v-model="queryParams.time" 
                                    type="daterange"
                                    placeholder="请选择安装时间"
                                    style="width:100%"
                                    value-format="yyyy-MM-dd" ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="c-container">
            <div class="c-content">
                <div class="tool-row">
                    <el-button
                        type="primary"
                        plain
                        size="mini"
                        @click="handleExport"
                    >导出</el-button>

                </div>
                <div class="grid-wrap">
                    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center" />
                        <el-table-column type="index" label="序号" width="50" align="center" />

                        <el-table-column label="工单号" align="center"  prop="workOrderNo" width="200px"  />
                        <el-table-column label="设备类型" align="center"  prop="applyTypeDesc" width="100px" />
                        <el-table-column label="内容描述" align="center"  prop="applyContent" width="200px"  />
                        <el-table-column label="完成期限" align="center"  prop="createTime"  width="120px" >
                            <template slot-scope="scope">
                                <div>{{new Date(scope.row.expectedFinishTime).Format('yyyy-MM-dd')}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="使用时长" align="center"  prop="serviceLifeTimeStr"  width="200px"></el-table-column>
                        <el-table-column label="生成时间" align="center" prop="applyTime" width="120px" >
                             <template slot-scope="scope">
                                <div>{{new Date(scope.row.workOrderCreateTime).Format('yyyy-MM-dd')}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="上报人" align="center"  prop="applyUserNickName"  width="120px" />
                        <el-table-column label="审批人" align="center"  prop="auditUserNickName"  width="120px"  />
                        <el-table-column label="处理人" align="center"  prop="auditUserNickName"   width="120px" />

                        <el-table-column label="工单状态" align="center"  prop="statusCodeDesc"  />
                        <el-table-column label="处理结果" align="center" prop="workOrderHandleResultContent"  />
                        <el-table-column label="复核结果" align="center"  prop="workOrderCheckResultContent"  />

                        <el-table-column label="定位" align="center"  width="230px" >
                            <template slot-scope="scope">
                                <div style="display:flex;align-items:center">
                                    <div>{{scope.row.applyDept.deptAddr}}</div>
                                    <i @click="openMap(scope.row.applyDept.deptAddr)" style="font-size:16px;cursor: pointer;color:#1890ff" class="el-icon-location-information"></i>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" width="100px" align="center" >
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleUpdate(scope.row)"
                                    v-if="scope.row.statusCode == 'WORK_ORDER_WAIT'"
                                >处理</el-button>
                                <el-button
                                    size="mini"
                                    type="text"
                                    v-if="scope.row.statusCode == 'WORK_ORDER_WAIT_CHECK'"
                                    @click="handleUpdate(scope.row)"
                                >复核</el-button>
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleView(scope.row)"
                                >详情</el-button>
                                
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <pagination
                    v-show="total>0"
                    :total="total"
                    :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize"
                    @pagination="getList"
                />
            </div>
        </div>
        <el-dialog title="提交工单处理结果" :visible.sync="auditState" width="512px">
            <div>
                <el-form ref="auditForm" :model="auditForm" label-width="120px">
                    <el-form-item label="序号:">
                        <span>{{detail.id}}</span>
                    </el-form-item>
                    <el-form-item label="生成工单号:">
                        <span>{{detail.workOrderNo}}</span>
                    </el-form-item>
                    <el-form-item label="申请人:">
                        <span>{{detail.applyUserNickName}}</span>
                    </el-form-item>
                    <el-form-item label="内容描述:">
                        <span>{{detail.applyContent}}</span>
                    </el-form-item>
                    
                    <el-form-item label="完成期限:">
                        <span>{{new Date(detail.expectedFinishTime).Format('yyyy-MM-dd')}}</span>
                    </el-form-item>
                    <!-- <el-form-item label="处理意见" v-if="detail.statusCode== 'WORK_ORDER_WAIT'"> 
                        <el-radio-group v-model="auditForm.success">
                            <el-radio :label="true">通过</el-radio>
                            <el-radio :label="false">不通过</el-radio>
                        </el-radio-group>
                    </el-form-item> -->
                    <el-form-item label="处理结果:" prop="handleResultContent" v-if="detail.statusCode== 'WORK_ORDER_WAIT'">
                        <el-input v-model="auditForm.handleResultContent" type="textarea" placeholder="请输入处理结果" style="width:100%"></el-input>
                    </el-form-item>
                    <el-form-item label="复核通过" v-if="detail.statusCode== 'WORK_ORDER_WAIT_CHECK'"> 
                        <el-radio-group v-model="auditForm.success">
                            <el-radio :label="true">通过</el-radio>
                            <el-radio :label="false">不通过</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="复核结果:" prop="handleResultContent" v-if="detail.statusCode== 'WORK_ORDER_WAIT_CHECK'">
                        <el-input v-model="auditForm.handleResultContent" type="textarea" placeholder="请输入复核结果" style="width:100%"></el-input>
                    </el-form-item>
                    <el-form-item label="" >
                        <el-upload
                                :headers="headers"
                                :action="uploadFileUrl"
                                :before-remove="handleFileRemove"
                                :on-success="handleFileSuccess"
                                :file-list="fileList">
                            <el-button size="small" type="primary">上传文件</el-button></el-upload>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="auditState = false">取 消</el-button>
                <el-button type="primary" @click="submitHandleResult">提 交</el-button>
            </div>
        </el-dialog>
        
        <show-map v-if="showMapState" :visible="showMapState" :lng="showMapLongitude" :lat="showMapLatitude" @close="showMapState = false"></show-map>
        <detail :dialogShow="detailState" :id="detail_id" v-if="detailState" @close="detailState = false"></detail>

    </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import showMap from '@/components/show-map/index.vue'
import detail from './component/detail.vue'

import { getMyWorkOrderListPaged,getApplyDetail,submitHandleResult,submitCheckHandleResult } from "@/api/lampPost";


export default {
    dicts: ['sys_road', 'sys_audit_status'],
     components:{
        showMap,
        detail
    },
    data(){
        return {
            showMapState:false,
            showMapLongitude:'',
            showMapLatitude:'',
            loading: false,
            total:0,
            queryParams:{
                pageNum:1,
                pageSize:20,
                time:[],
                applyQueryStartTime:'',
                applyQueryEndTime:'',
                statusCode:''
            },
            ids:[],
            list:[],
            detailState:false,
            auditState:false,
            auditForm:{
                approvalId:'',
                handleResultContent:'',
                fileUrlList: [],
                success: true,
                secondAuditDeptId:'',
                secondAuditUserId:''
            },
            multAudit:'',
            detail:{
                id:'6',
                content:'摄像头申请摄像头申请',
                applyType:'',
                applyTypeDesc:'使用申请',
                applyContent:'',
                deviceModel:'17027037019',
                deviceUid:'2930280304040',
                deviceName:'',
                deviceRoad:'',
                deviceLongitude:'',
                deviceLatitude:'',
                applyDevice:'',
                applyDeviceDesc:'摄像头',
                applyUserId:'',
                applyUserNickName:'李某某',
                applyUserDeptName:'研发部',
                applyUserDeptAddr:'',
                approvalDept:{
                    addr:'盈丰街道盈丰路'
                },
                serviceLifeType:'',
                serviceLifeTimeStr:'5h',
                serviceLifeStartTime:'',
                serviceLifeEndTime:'',
                auditUserId:'',
                auditUserNickName:'',
                auditUserDeptName:'',
                secondAudit:false,
                secondAuditUserId:'',
                secondAuditUserNickName:'',
                secondAuditUserDeptName:'',
                statusCode:'',
                statusCodeDesc:'',
                wordOrderNo:'',
                applyTime:'2023-04-01 11:22:01',
                auditTime:'',
                finishTime:'',
                expectedFinishTime:'',
                applyDeptId:'',
                handleUserId:'',
                handleUserNickName:'',
                handleUserDeptName:'',
                checkWorkOrderUserId:'',
                checkWorkOrderUserNickName:'',
                checkWorkOrderUserDeptName:'',
                needCheckWorkOrder:'',
                workOrderCreateTime:'',
                auditVo:'',
                secondAuditVo:'',
                workOrderHandleResult:'',
                workOrderCheckResult:'',
                workOrderCheckResultworkOrderCheckResult:'',
                isDeleted:''
            },
            secondAuditDeptList:[],
            secondAuditUserList:[],
            uploadList: [],
            uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload", // 上传文件服务器地址
            headers: {
                Authorization: "Bearer " + getToken(),
            },
            fileList: [],
            workForm:{
                approvalId:'',
                success:'',
                handleResultContent:''
            },
            detail_id:'',
        }
    },
    methods:{
        handleFileRemove(file, filelist){
            if (file.response.code == 200) {
                let index = null
                let fileUrl = file.response.data.url;
                this.auditForm.fileUrlList.forEach((url,i) => {
                    if (fileUrl == url) {
                        index = i
                    }
                })

                if (index != null) {
                    this.auditForm.fileUrlList.splice(index, 1)
                }
            }
        },
        handleFileSuccess(res, file, filelist){
            if (res.code == 200) {
                this.auditForm.fileUrlList.push(res.data.url)
            }
        },
        submitHandleResult(){
            this.$refs["auditForm"].validate(valid => {
                if (valid) {
                    let form = JSON.parse(JSON.stringify(this.auditForm))
                    form.approvalId = this.detail.id
                    form.needCheckWorkOrder = this.multAudit == 1 ? true : false
                    if (form.expectedFinishTime) {
                        form.expectedFinishTime = new Date(form.expectedFinishTime).getTime()
                    }
                    if (this.detail.statusCode == 'WORK_ORDER_WAIT') {
                        submitHandleResult(form).then(res => {
                            if (res.code === 200) {
                                this.$modal.msgSuccess("处理成功");
                                this.auditState = false
                                this.getList();
                            }
                        })
                    }

                    if (this.detail.statusCode == 'WORK_ORDER_WAIT_CHECK') {
                        submitCheckHandleResult(form).then(res => {
                            if (res.code === 200) {
                                this.$modal.msgSuccess("处理成功");
                                this.auditState = false
                                this.getList();
                            }
                        })
                    }
                    
                }
            });
        },
        openMap(row){
            this.showMapLatitude = row.deviceLatitude
            this.showMapLongitude = row.deviceLongitude

            this.showMapState = true
        },
        submitAudit(){
             this.$modal.msgSuccess("提交成功");
            this.auditState = false
        },
        departChange(){

        },
        
        handleQuery(){
            this.queryParams.pageNum = 1;
            this.getList()
        },
        resetQuery(){

        },
        handleMultDelete(){
            if (this.ids.length == 0) {
                this.$modal.msgError("请选择需要删除的数据");
                return
            }

            // this.$modal.confirm('是否确认删除该数据吗？').then(() => {
            //     return deleteDevice(this.ids.join(','));
            // }).then(() => {
            //     this.getList();
            //     this.$modal.msgSuccess("删除成功");
            // }).catch(() => {});
        },
        handleExport(){
            let queryParams ={
                applyQueryStartTime:'',
                applyQueryEndTime:'',
                statusCode:this.queryParams.statusCode
            }

            if (this.queryParams.time.length > 0) {
                queryParams.applyQueryStartTime = new Date(this.queryParams.time[0]).getTime()
                queryParams.applyQueryEndTime = new  Date(this.queryParams.time[1]).getTime()
            }
            this.download('/slp/slp/approval/getMyWorkOrderListPaged/export', queryParams, `device_${new Date().getTime()}.xlsx`) 

        },
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
        },
        handleView(row){
            this.detail_id = row.id;
            this.detailState = true;

        },
        handleUpdate(row){
            getApplyDetail({
                id:row.id
            }).then(res => {
                if (res.code == 200) {
                    this.$set(this,'detail', res.data)
                    this.auditState = true
                }
            })
        },
        getList(){
             let params = {
                pageNum: this.queryParams.pageNum,
                pageSize: this.queryParams.pageSize,
                applyQueryStartTime:'',
                applyQueryEndTime:'',
                statusCode: this.queryParams.statusCode
            }

            if (this.queryParams.time.length > 0) {
                params.applyQueryStartTime = new Date(this.queryParams.time[0]).getTime()
                params.applyQueryEndTime = new Date(this.queryParams.time[1]).getTime()
            }

            getMyWorkOrderListPaged(params).then(res => {
                if (res.code == 200) {
                        this.total = res.total
                        this.list = res.rows || []
                }
            })
        },
        handleDelete(row){
            this.$modal.confirm('是否确认删除该数据吗？').then(function() {
                return Promise.resolve();
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
    },
    created(){
        this.getList()
    }
}
</script>
<style lang="scss">
.my-order{
    display: flex;
    flex-direction: column;

    .h104{
        height: 104px;
        width: 100%;
        background-color: #fff;
        border-radius: 4px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 24px;

        .el-form{
            width: 100%;

            .el-form-item--small.el-form-item{
                margin-bottom: 0;
            }
        }
    }

     .c-container{
        flex: 1;
        height: 0;
        width: 100%;
        display: flex;
        flex-direction: column;

        .c-content{
            flex: 1;
            height: 0;
            width: 100%;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding: 32px 24px;
            background-color: #fff;

            .tool-row{
                margin-bottom: 16px;
            }

            .grid-wrap{
                flex: 1;
                height: 0;
                width: 100%;
            }
        }
    }

    .apply-section{
        min-height: 120px;
        width: 100%;
        background: #f8f9fb;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 24px 32px;
        margin-bottom: 24px;

        .apply-section-header{
            display: flex;
            align-items: center;
            justify-content: space-between;

            .title{
                position: relative;
                padding-left: 14px;
                font-size: 20px;
                font-weight: 500;
                color: #333333;
                line-height: 20px;

                &::after{
                    content: ' ';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 4px;
                    height: 20px;
                    background: #409efe;
                }
            }
        }

        .content{
            font-size: 16px;
            font-weight: 400;
            color: #333333;
            line-height: 24px;
            margin-top: 28px;
        }
    }
}
</style>
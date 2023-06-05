<template>
    <div class="app-container my-audit" style="background:#eee;height:calc(100vh - 50px)">
        <div class="h104">
            <el-form :model="queryParams" size="small" :inline="true">
                <el-form-item label="状态" prop="type">
                    <el-select v-model="queryParams.statusCode" placeholder="请选择状态">
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
                     <!-- <el-button
                        type="primary"
                        plain
                        size="mini"
                        @click="handleMultDelete"
                    >批量处理</el-button> -->
                    <el-button
                        type="primary"
                        plain
                        size="mini"
                        @click="handleMultDelete"
                    >批量删除</el-button>
                </div>
                <div class="grid-wrap">
                    <el-table ref="tables" style="width:100%;height:100%" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center" />
                        <el-table-column label="序号" align="center"  prop="id"  />
                        <el-table-column label="申请内容" align="center"  prop="applyContent"  />
                        <el-table-column label="申请时间" align="center"  prop="applyTime" width="200px" >
                            <template slot-scope="scope">
                                <div>{{new Date(scope.row.applyTime).Format('yyyy-MM-dd hh:mm:ss')}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" align="center"  prop="applyTypeDesc"  />
                        <el-table-column label="申请人" align="center"  prop="applyUserNickName"  />
                        <el-table-column label="申请单位" align="center"  prop="applyUserDeptName"  />
                        <el-table-column label="审批人" align="center"  prop="auditUserNickName"  />
                        <el-table-column label="审批时间" align="center"  prop="auditTime" width="200px" >
                            <template slot-scope="scope">
                                <div>{{new Date(scope.row.auditTime).Format('yyyy-MM-dd hh:mm:ss')}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" align="center"  prop="statusCodeDesc"  />
                        <el-table-column label="定位" align="center"  width="230px" >
                            <template slot-scope="scope">
                                <div style="display:flex;align-items:center">
                                    <div>{{scope.row.applyDept.deptAddr}}</div>
                                    <i @click="openMap(scope.row.applyDept.deptAddr)" style="font-size:16px;cursor: pointer;color:#1890ff" class="el-icon-location-information"></i>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" >
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="text"
                                    v-if="scope.row.statusCode == 'WAIT' || scope.row.statusCode == 'SECOND_AUDIT_WAIT'"
                                    @click="handleUpdate(scope.row)"
                                >审批</el-button>
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleView(scope.row)"
                                >详情</el-button>
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleDelete(scope.row)"
                                >删除</el-button>
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
        <el-dialog title="审批" :visible.sync="auditState" width="800px">
            <el-form  ref="auditForm" :model="auditForm" label-width="130px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="序号:">
                            <span>{{detail.id}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请类型:">
                            <span>{{detail.applyTypeDesc}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请人:">
                            <span>{{detail.applyUserNickName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="使用时长:">
                            <span>{{detail.serviceLifeTimeStr}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="申请内容:">
                            <span>{{detail.applyContent}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请设备类型:">
                            <span>{{detail.applyDeviceDesc}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请设备型号:">
                            <span>{{detail.deviceUid}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请设备数量:">
                            <span>{{detail.applyDeviceNum || 0}}个</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请单位:">
                            <span>{{detail.applyUserDeptName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="detail.applyDept">
                        <el-form-item label="申请单位地址:">
                            <div>
                                <i @click="openMap" style="font-size:16px;cursor: pointer;color:#1890ff" class="el-icon-location-information"></i>
                                <span>{{detail.applyDept.deptAddr}}</span>

                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="detail.secondAuditUserId">
                        <el-form-item label="审批人:">
                            <span>{{detail.secondAuditUserNickName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="detail.secondAuditUserId">
                        <el-form-item label="审批意见:">
                            <span>{{detail.statusCodeDesc}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="detail.secondAuditUserId">
                        <el-form-item label="">
                            <div>fileList</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="审批意见">
                            <el-radio-group v-model="auditForm.success">
                                <el-radio :label="true">审批通过</el-radio>
                                <el-radio :label="false">审批不通过</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="">
                            <el-input type="textarea" v-model="auditForm.content" placeholder="请输入审批意见"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="">
                            <el-upload
                                :headers="headers"
                                :action="uploadFileUrl"
                                :before-remove="handleFileRemove"
                                :on-success="handleFileSuccess"
                                :file-list="fileList">
                            <el-button size="small" type="primary">上传文件</el-button></el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="!detail.secondAudit">
                        <el-form-item label="是否需要多轮审批">
                            <el-select v-model="multAudit">
                                <el-option
                                        label="是"
                                        value="1"
                                    />
                                <el-option
                                        label="否"
                                        value="0"
                                    />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="multAudit == 1">
                        <el-form-item label="审核部门:">
                            <treeselect v-model="auditForm.secondAuditDeptId" :options="deptOptions" :normalizer="normalizer" placeholder="请选择审核部门" />               
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="multAudit == 1">
                        <el-form-item label="审核人员:">
                            <el-select v-model="auditForm.secondAuditUserId">
                                    <el-option
                                        v-for="dict in auditUserList"
                                        :key="dict.userId"
                                        :label="dict.nickName"
                                        :value="dict.userId"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="auditState = false">取 消</el-button>
                <el-button type="primary" @click="submitAudit">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="详情" :visible.sync="detailState" width="800px">
            <el-form label-width="130px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="序号:">
                            <span>{{detail.id}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请人:">
                            <span>{{detail.applyUserDeptName + detail.applyUserNickName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请时间:">
                            <span>{{detail.applyTime}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请类型:">
                            <span>{{detail.applyTypeDesc}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请设备类型:">
                            <span>{{detail.applyDeviceDesc}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="使用时长:">
                            <span>{{detail.serviceLifeTimeStr}}</span>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="12">
                        <el-form-item label="申请设备型号:">
                            <span>{{detail.deviceModel}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请设备数量:">
                            <span>{{detail.applyDeviceNum || 0}}个</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请设备UID:">
                            <span>{{detail.deviceUid}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请单位:">
                            <span>{{ detail.applyUserDeptName }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="detail.applyDept">
                        <el-form-item label="申请单位地址:">
                            <div>
                                <i @click="openMap" style="font-size:16px;cursor: pointer;color:#1890ff" class="el-icon-location-information"></i>
                                <span>{{detail.applyDept.deptAttr}}</span>

                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="申请内容">
                            <div>{{detail.applyContent}}</div>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24" v-if="detail.auditVo.auditTime">
                        <div class="apply-section">
                            <div class="apply-section-header">
                                <div class="title">审批结果</div>
                                <div class="time">{{new Date(detail.auditVo.auditTime).Format('yyyy-MM-dd hh:mm:ss')}}</div>
                            </div>
                            <div class="content">{{detail.auditVo.content}}</div>
                        </div>
                    </el-col>
                    <el-col :span="24" v-if="detail.secondAuditVo && detail.secondAuditVo.auditTime">
                        <div class="apply-section">
                            <div class="apply-section-header">
                                <div class="title">二轮审批结果</div>
                                <div class="time">{{new Date(detail.secondAuditVo.auditTime).Format('yyyy-MM-dd hh:mm:ss')}}</div>
                            </div>
                            <div class="content">{{detail.secondAuditVo.content}}</div>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <show-map v-if="showMapState" :visible="showMapState" :lng="showMapLongitude" :lat="showMapLatitude" @close="showMapState = false"></show-map>

    </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import showMap from '@/components/show-map/index.vue'

import { getMyAuditListPaged,getApplyDetail,submitAudit,submitSecondAudit,deleteApply} from "@/api/lampPost";
import { listDept } from "@/api/system/dept";
import { listUser } from "@/api/system/user";


import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";


export default {
    dicts: ['sys_road', 'sys_audit_status'],
     components:{
        showMap,
        Treeselect
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
                content:'',
                fileUrlList: [],
                success: true,
                secondAuditDeptId: undefined,
                secondAuditUserId:''
            },
            multAudit:'',
            detail:{
                id:'',
                content:'',
                applyType:'',
                applyTypeDesc:'',
                applyContent:'',
                deviceModel:'',
                deviceUid:'',
                deviceName:'',
                deviceRoad:'',
                deviceLongitude:'',
                deviceLatitude:'',
                applyDevice:'',
                applyDeviceDesc:'',
                applyUserId:'',
                applyUserNickName:'',
                applyUserDeptName:'',
                applyUserDeptAddr:'',
                applyDept:{
                    deptAttr:''
                },
                serviceLifeType:'',
                serviceLifeTimeStr:'',
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
                applyTime:'',
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
                auditVo:{},
                secondAuditVo:{},
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
            deptOptions: [],
            auditUserList:[]
        }
    },
     watch:{
        'auditForm.secondAuditDeptId'(val){
            console.log(val)
            if (val) {
                listUser({
                    deptId:val,
                    pageNum:1,
                    pageSize:9999
                }).then(res => {
                    if (res.code == 200) {
                        this.$set(this, 'auditUserList', res.rows || [])
                    }
                })
            }
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
        initDept(){
            listDept().then(response => {
                this.deptOptions = this.handleTree(response.data, "deptId");
            });
        },
        /** 转换部门数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.deptId,
                label: node.deptName,
                children: node.children
            };
        },
        openMap(row){
            this.showMapLatitude = row.deviceLatitude
            this.showMapLongitude = row.deviceLongitude

            this.showMapState = true
        },
        submitAudit(){
            this.$refs["auditForm"].validate(valid => {
                if (valid) {
                    let form = JSON.parse(JSON.stringify(this.auditForm))
                    if (this.detail.secondAudit == true) {
                        let params = {
                                approvalId: this.detail.id,
                                content: this.auditForm.content,
                                fileUrlList: this.auditForm.fileUrlList,
                                success: this.auditForm.success,
                        }
                        submitSecondAudit(params).then(res => {
                             if (res.code == 200) {
                                this.$modal.msgSuccess("操作成功");
                                this.auditState = false
                                this.getList()

                            }
                        })
                    } else {
                        let params = {
                                approvalId: this.detail.id,
                                content: this.auditForm.content,
                                fileUrlList: this.auditForm.fileUrlList,
                                success: this.auditForm.success,
                                secondAuditDeptId: '',
                                secondAuditUserId:''
                        }

                        if (this.multAudit == 1) {
                            params.secondAuditDeptId = this.auditForm.secondAuditDeptId
                            params.secondAuditUserId = this.auditForm.secondAuditUserId
                        }

                        submitAudit(params).then(res => {
                            if (res.code == 200) {
                                this.$modal.msgSuccess("操作成功");
                                this.auditState = false
                                this.getList()

                            }
                        })
                    }
                }
            });
        },
        departChange(){

        },
        
        handleQuery(){
            this.queryParams.pageNum = 1
            this.getList()
        },
        resetQuery(){

        },
        handleMultDelete(){
            if (this.ids.length == 0) {
                this.$modal.msgError("请选择需要删除的数据");
                return
            }

            this.$modal.confirm('是否确认删除该数据吗？').then(() => {
                return deleteApply(this.ids.join(','));
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
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
            this.download('/slp/slp/approval/getMyAuditListPaged/export', queryParams, `device_${new Date().getTime()}.xlsx`) 
        },
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
        },
        handleView(row){
            getApplyDetail({
                id:row.id
            }).then(res => {
                if (res.code == 200) {
                    this.$set(this,'detail', res.data)
                    this.detailState = true
                }
            })
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
                params.applyQueryEndTime = new  Date(this.queryParams.time[1]).getTime()
            }

            getMyAuditListPaged(params).then(res => {
                if (res.code == 200) {
                        this.total = res.total
                        this.list = res.rows || []
                }
            })
        },
        handleDelete(row){
            this.$modal.confirm('是否确认删除该数据吗？').then(function() {
                return deleteApply(row.id);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
    },
    created(){
        this.getList()
        this.initDept()
    }
}
</script>
<style lang="scss">
.my-audit{
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
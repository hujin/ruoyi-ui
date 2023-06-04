<template>
    <div class="app-container my-audit" style="background:#eee;height:calc(100vh - 50px)">
        <div class="h104">
            <el-form :model="queryParams" size="small" :inline="true">
                <el-form-item label="状态" prop="statusCode">
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
                        size="mini"
                        @click="auditState = true"
                    >添加申请</el-button>
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
                                <div>{{new Date(scope.row.applyTime).Format('yyyy-MM-dd')}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" align="center"  prop="applyTypeDesc"  />
                        <el-table-column label="申请人" align="center"  prop="applyUserNickName"  />
                        <el-table-column label="申请单位" align="center"  prop="applyUserDeptName"  />
                        <el-table-column label="审批人" align="center"  prop="auditUserNickName"  />
                        <el-table-column label="审批时间" align="center"  prop="auditTime"  >
                            <template slot-scope="scope">
                                <div>{{new Date(scope.row.auditTime).Format('yyyy-MM-dd')}}</div>
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
                        <el-table-column label="操作" fixed="right" align="center" width="200px">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="text"
                                    v-if="scope.row.statusCode == 'AUDIT_SUC'"
                                    @click="openWorkOrder(scope.row)"
                                >生成工单</el-button>
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="openDetail(scope.row)"
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
        <el-dialog title="提交" :visible.sync="auditState" width="512px">
            <div>   
                <el-form ref="auditForm" :model="auditForm" label-width="100px">
                    <!-- <el-form-item label="序号:">
                        <span>7</span>
                    </el-form-item> -->
                    <el-form-item label="提交人:">
                        <span>{{username}}</span>
                    </el-form-item>
                    <el-form-item label="申请类型:" prop="applyType">
                        <el-select v-model="auditForm.applyType" placeholder="请选择申请类型" style="width:100%">
                            <el-option
                                v-for="dict in dict.type.sys_apply_type"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="内容描述:" prop="applyContent">
                        <el-input v-model="auditForm.applyContent" type="textarea" placeholder="请输入内容描述" style="width:100%"></el-input>
                    </el-form-item>
                    <el-form-item label="道路:" >
                        <el-select v-model="road" placeholder="请选择道路" style="width:100%" @change="roadChange">
                            <el-option
                                v-for="dict in dict.type.sys_road"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关联灯杆:" prop="deviceUid">
                        <el-select v-model="auditForm.deviceUid" placeholder="请选择关联灯杆" style="width:100%" @change="lampPostChange">
                            <el-option
                                v-for="dict in lampPostList"
                                :key="dict.uid"
                                :label="dict.name"
                                :value="dict.uid"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="申请设备:" prop="applyDeviceUid">
                        <el-select v-model="auditForm.applyDeviceUid" placeholder="请选择道路" style="width:100%" @change="deviceChange">
                            <el-option
                                v-for="dict in deviceList"
                                :key="dict.uid"
                                :label="dict.name"
                                :value="dict.uid"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="使用期限类型:" prop="serviceLifeType">
                        <el-radio-group v-model="auditForm.serviceLifeType">
                            <el-radio label="LONG">长期</el-radio>
                            <el-radio label="SHORT">短期</el-radio>
                        </el-radio-group>
                    </el-form-item>
                     <el-form-item label="使用期限:" porp="serviceLifeTime" v-if="auditForm.serviceLifeType == 'SHORT'"> 
                        <el-date-picker v-model="auditForm.serviceLifeTime" 
                                    type="daterange"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    style="width:100%"
                                    value-format="yyyy-MM-dd" ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="审核部门:" prop="auditDeptId">
                        <treeselect v-model="auditForm.auditDeptId" :options="deptOptions" :normalizer="normalizer" placeholder="请选择审核部门" />               
                    </el-form-item>
                    <el-form-item label="审核人员:" prop="auditUserId">
                        <el-select v-model="auditForm.auditUserId" placeholder="请选择审核人员" style="width:100%">
                            <el-option
                                v-for="dict in auditUserList"
                                :key="dict.userId"
                                :label="dict.nickName"
                                :value="dict.userId"/>
                        </el-select>
                    </el-form-item>

                </el-form>
            </div>
           
            <div slot="footer" class="dialog-footer">
                <el-button @click="auditState = false">取 消</el-button>
                <el-button type="primary" @click="submitApply">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="生成工单" :visible.sync="workState" width="512px">
            <div>
                <el-form ref="workForm" :model="workForm" label-width="120px">
                    <el-form-item label="序号:">
                        <span>{{detail.id}}</span>
                    </el-form-item>
                    <el-form-item label="提交人:">
                        <span>{{detail.applyUserNickName}}</span>
                    </el-form-item>
                    <el-form-item label="申请人:">
                        <span>{{detail.applyUserNickName}}</span>
                    </el-form-item>
                    <el-form-item label="内容描述:">
                        <span>{{detail.applyContent}}</span>
                    </el-form-item>
                    <el-form-item label="关联灯杆:">
                        <span>{{detail.deviceName}}</span>
                    </el-form-item>
                    <el-form-item label="申请设备:">
                        <span>{{detail.applyDeviceDesc}}</span>
                    </el-form-item>
                    <el-form-item label="使用期限:">
                        <span>{{detail.serviceLifeTimeStr}}</span>
                    </el-form-item>
                     <el-form-item label="派单部门:" prop="handleDeptId">
                        <treeselect v-model="workForm.handleDeptId" :options="deptOptions" :normalizer="normalizer" placeholder="请选择审核部门" />               
                    </el-form-item>
                    <el-form-item label="派单人员:" prop="handleUserId">
                        <el-select v-model="workForm.handleUserId" placeholder="请选择部门" style="width:100%">
                            <el-option
                                v-for="dict in handleUserList"
                                :key="dict.userId"
                                :label="dict.nickName"
                                :value="dict.userId"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="完成期限:" prop="expectedFinishTime">
                        <el-date-picker v-model="workForm.expectedFinishTime" 
                                    type="date"
                                    placeholder="请选择完成期限"
                                    style="width:100%"
                                    value-format="yyyy-MM-dd" ></el-date-picker>
                        
                    </el-form-item>
                    <el-form-item label="是否复核">
                        <el-select v-model="multAudit" style="width:100%">
                            <el-option label="是" value="1" />
                            <el-option label="否" value="0" />
                         </el-select>
                    </el-form-item>
                    <el-form-item label="审核部门:" prop="checkWorkOrderDeptId" v-if="multAudit == 1">
                        <treeselect v-model="workForm.checkWorkOrderDeptId" :options="deptOptions" :normalizer="normalizer" placeholder="请选择审核部门" />               

                        
                    </el-form-item>
                    <el-form-item label="审核人员:" prop="checkWorkOrderUserId"  v-if="multAudit == 1">
                        <el-select v-model="workForm.checkWorkOrderUserId" placeholder="请选择人员" style="width:100%">
                             <el-option
                                v-for="dict in checkWorkOrderUserList"
                                :key="dict.userId"
                                :label="dict.nickName"
                                :value="dict.userId"/>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="workState = false">取 消</el-button>
                <el-button type="primary" @click="submitOrder">确 定</el-button>
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

import { getMyApplyList,
         submitApply,
         getDeviceList,
         getApplyDetail,
         createWorkOrder,
         deleteApply} from "@/api/lampPost";
import { listDept } from "@/api/system/dept";
import { listUser } from "@/api/system/user";


import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
    dicts: ['sys_road', 'sys_audit_status','sys_apply_type'],
    components:{
        showMap,
        detail,
        Treeselect
    },
    data(){
        return {
            showMapState:false,
            showMapLongitude:'',
            showMapLatitude:'',
            road:'',
            lampPostList:[],
            deviceList:[],
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
                applyUserId:'',
                applyDeptId: undefined,
                applyType:'',
                auditUserId: '',
                lampPostId:'',
                deviceUid:'',
                applyDevice:'',
                applyContent:'',
                serviceLifeType:'LONG',
                serviceLifeTime:[],
                serviceLifeStartTime:'',
                serviceLifeEndTime:''
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
                applyDeviceUid:'',
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
            workState: false,
            workForm:{
                approvalId:'',
                handleDeptId:undefined,
                handleUserId:'',
                needCheckWorkOrder:false,
                expectedFinishTime:'',
                checkWorkOrderDeptId:'',
                checkWorkOrderUserId:''
            },
            deptOptions: [],
            auditUserList:[],
            handleUserList:[],
            checkWorkOrderUserList:[],
            detail_id:''
        }
    },
    watch:{
        'auditForm.auditDeptId'(val){
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
        },
         'workForm.handleDeptId'(val){
            console.log(val)
            if (val) {
                listUser({
                    deptId:val,
                    pageNum:1,
                    pageSize:9999
                }).then(res => {
                    if (res.code == 200) {
                        this.$set(this, 'handleUserList', res.rows || [])
                    }
                })
            }
        },
         'workForm.checkWorkOrderDeptId'(val){
            console.log(val)
            if (val) {
                listUser({
                    deptId:val,
                    pageNum:1,
                    pageSize:9999
                }).then(res => {
                    if (res.code == 200) {
                        this.$set(this, 'checkWorkOrderUserList', res.rows || [])
                    }
                })
            }
        }
    },
    methods:{
        openWorkOrder(row){
            getApplyDetail({id:row.id}).then(res => {
                if (res.code === 200) {
                    this.$set(this, 'detail', res.data)
                    this.$nextTick(() => {
                        this.workState = true
                    })
                }
            })
        },
        openDetail(row){
            this.detail_id = row.id;
            this.detailState = true
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
        deviceChange(val){
            if (val) {
                this.deviceList.forEach(item => {
                    if (item.uid == val) {
                        this.auditForm.applyDevice = item.type
                    }
                })
            }
        },
        lampPostChange(val){
            if (val) {
                let device_list = []
                this.lampPostList.forEach(item => {
                    if (item.uid == val){
                        device_list = item.slpOtherDeviceInfoList
                    }
                })

                this.$set(this, 'deviceList', device_list)
            }
        },
        roadChange(val){
            console.log(val)
            if (val) {
                this.getDeviceList(val)
            }
        },
        openMap(row){
            this.showMapLatitude = row.deviceLatitude
            this.showMapLongitude = row.deviceLongitude

            this.showMapState = true
        },
        submitOrder(){
            this.$refs["workForm"].validate(valid => {
                if (valid) {
                    let form = JSON.parse(JSON.stringify(this.workForm))
                    form.approvalId = this.detail.id
                    form.needCheckWorkOrder = this.multAudit == 1 ? true : false
                    if (form.expectedFinishTime) {
                        form.expectedFinishTime = new Date(form.expectedFinishTime).getTime()
                    }
                    createWorkOrder(form).then(res => {
                        if (res.code === 200) {
                            this.$modal.msgSuccess("派单成功");
                            this.workState = false
                            this.getList();
                        }
                    })
                }
            });
            
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

            this.$modal.confirm('是否确认删除该数据吗？').then(() => {
                return deleteApply(this.ids.join(','));
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        handleExport(){

        },
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
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
                params.applyQueryStartTime = this.queryParams.time[0]
                params.applyQueryEndTime = this.queryParams.time[1]
            }

            getMyApplyList(params).then(res => {
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
        submitApply(){
            this.$refs["auditForm"].validate(valid => {
                if (valid) {
                    let form = JSON.parse(JSON.stringify(this.auditForm))
                    if (form.serviceLifeType == 'SHORT') {
                        form.serviceLifeStartTime =  new Date(form.serviceLifeTime[0]).getTime()
                        form.serviceLifeEndTime = new Date(form.serviceLifeTime[1]).getTime()

                    }
                    submitApply(form).then(res => {
                        if (res.code === 200) {
                            this.$modal.msgSuccess("申请成功");
                            this.auditState = false
                            this.getList();
                        }
                    })
                }
            });
        },
        getDeviceList(road){
            let params = {
                road,
                pageNum: 1,
                pageSize: 9999,
            }

            getDeviceList(params).then(res => {
                if (res.code == 200) {
                    this.$set(this, 'lampPostList', res.rows)
                }
            })
        }
    },
    computed:{
        username(){
            return  this.$store.state.user.nickName
        }
    },
    created(){
        this.initDept();
        this.getList()
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
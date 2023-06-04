<template>
    <div class="app-container my-audit" style="background:#eee;height:calc(100vh - 50px)">
 
        <div class="c-container">
            <div class="c-content">
                <div class="tool-row">
                    <el-button
                        type="primary"
                        size="mini"
                        @click="auditState = true"
                    >添加单位</el-button>
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
                        <el-table-column label="新增日期" align="center"  prop="applyContent"  />
                        <el-table-column label="单位名称" align="center"  prop="applyTime" width="200px" />
                        <el-table-column label="单位属性" align="center"  prop="applyTypeDesc"  />
                        <el-table-column label="单位人数" align="center"  prop="applyUserNickName"  />
                        <el-table-column label="地址" align="center"  prop="applyUserDeptName"  />
                        <el-table-column label="定位" align="center"  width="230px" >
                            <template slot-scope="scope">
                                <div style="display:flex;align-items:center">
                                    <div>杭州市萧山区盈丰街道盈丰路</div>
                                    <i @click="openMap(scope.row)" style="font-size:16px;cursor: pointer;color:#1890ff" class="el-icon-location-information"></i>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" align="center" width="200px">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="workState = true"
                                >生成工单</el-button>
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="detailState = true"
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
      
    
       
        <show-map v-if="showMapState" :visible="showMapState" :lng="showMapLongitude" :lat="showMapLatitude" @close="showMapState = false"></show-map>

    </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import showMap from '@/components/show-map/index.vue'
import detail from './component/detail.vue'

export default {
    dicts: ['sys_road', 'sys_audit_status','sys_apply_type'],
     components:{
        showMap,
        detail
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
                type:''
            },
            ids:[],
            list:[],
            detailState:false,
            auditState:false,
            auditForm:{
                applyUserId:'',
                applyDeptId:'',
                applyType:'',
                auditUserId: '',
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
            }
        }
    },
    methods:{
         openMap(row){
            this.showMapLatitude = row.deviceLatitude
            this.showMapLongitude = row.deviceLongitude

            this.showMapState = true
        },
        submitOrder(){
            this.$modal.msgSuccess("派单成功");
            this.workState = false
        },
        submitAudit(){
            this.$modal.msgSuccess("提交成功");
            this.auditState = false
        },
        departChange(){

        },
       
        handleQuery(){

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

        },
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
        },
        handleUpdate(){

        },
        getList(){

        },
        handleDelete(row){
            this.$modal.confirm('是否确认删除该数据吗？').then(function() {
                return Promise.resolve();
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
    }
}
</script>
<style lang="scss">
.my-audit{
    display: flex;
    flex-direction: column;

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
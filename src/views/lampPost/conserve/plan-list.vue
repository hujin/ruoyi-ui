<template>
    <div class="app-container conserve-plan-list" style="background:#eee;height:calc(100vh - 50px)">
        <div class="h104">
            <el-form :model="queryParams" size="small" :inline="true">
                <el-form-item label="状态" prop="status">
                    <el-select v-model="queryParams.status" placeholder="请选择状态">
                        <el-option
                            label="未发布"
                            :value="0"
                        />
                        <el-option
                            label="执行中"
                            :value="1"
                        />
                        <el-option
                            label="已完成"
                            :value="2"
                        />
                        <el-option
                            label="取消"
                            :value="3"
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
                        icon="el-icon-plus"
                        size="mini"
                        @click="handleAdd"
                    >上报</el-button>
                    <el-button
                        type="primary"
                        plain
                        size="mini"
                        @click="handleMultDelete"
                    >批量删除</el-button>
                    <el-button
                        type="primary"
                        plain
                        size="mini"
                        @click="handleExport"
                    >导出</el-button>
                </div>
                <div class="grid-wrap">
                    <el-table ref="tables" style="width:100%;height:100%" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center" />
                        <el-table-column label="序号" align="center"  prop="id" width="50" />

                        <el-table-column label="计划名称" align="center"  prop="planName"  />
                        <el-table-column label="巡查时间" align="center"  prop="name"  >
                            <template slot-scope="scope">
                                <div>{{scope.row.beginTime + '至' + scope.row.endTime}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="内容描述" align="center"  prop="remark"  />
                       
                        <el-table-column label="巡检地点" align="center"  prop="inspectionAddress"  >
                            <template slot-scope="scope">
                                <div style="display:flex;align-items:center">
                                    <div style="white-space:nowrap">{{scope.row.inspectionAddress}}</div>
                                    <i @click="openMap(scope.row)" style="font-size:16px;cursor: pointer;color:#1890ff" class="el-icon-location-information"></i>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="关联灯杆" align="center"  prop="poleInfo"  />
                        <el-table-column label="巡查次数" align="center"  prop="inspectionWay"  />
                         <el-table-column label="巡检单位" align="center"  prop="inspectionUserDept"  />
                        <el-table-column label="巡检人" align="center"  prop="inspectionUserName"  />
                        <el-table-column label="计划状态" align="center"  >
                            <template slot-scope="scope">
                                <div>{{getStatusCn(scope.row.status)}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column label="生成时间" align="center"  prop="createTime" width="160px" />
                        <el-table-column label="操作" align="left" fixed="right" width="150px">
                            <template slot-scope="scope">
                                 <el-button
                                    size="mini"
                                    type="text"
                                    v-if="scope.row.status == 1"
                                    @click="handleUpdate(scope.row.id, 99)"
                                >取消计划</el-button>
                                <el-button
                                    size="mini"
                                    type="text"
                                    v-if="scope.row.status == 99"
                                    @click="handleUpdate(scope.row.id, 1)"
                                >发布</el-button>
                                 <el-button
                                    size="mini"
                                    type="text"
                                    v-if="scope.row.status == 99 || scope.row.status == 2 || scope.row.status == 1"
                                    @click="handleView(scope.row)"
                                >详情</el-button>
                                <el-button
                                    size="mini"
                                    type="text"
                                    v-if="scope.row.status == 0"
                                    @click="openDetail(scope.row)"
                                >编辑</el-button>
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
        <el-dialog title="巡查上报" width="512px" :visible.sync="dialogState">
            <div style="height:600px;overflow-y:scroll">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="计划名称:">
                    <el-input v-model="form.planName" placeholder="请输入计划名称"></el-input>
                </el-form-item>
                <el-form-item label="巡查时间">
                    <el-date-picker
                        v-model="form.date"
                        type="daterange"
                        style="width:100%"
                        range-separator="至"
                        start-placeholder="起始日期"
                        end-placeholder="截止日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="巡查内容">
                    <el-input type="textarea" placeholder="请输入巡查内容"  style="width:100%" v-model="form.remark"></el-input>
                </el-form-item>
                 <el-form-item label="">
                    <el-upload
                        :action="uploadFileUrl"
                        :headers="headers"
                        :before-remove="handleFileRemove"
                        :on-success="handleFileSuccess"
                        :file-list="fileList">
                            <el-button size="small" type="primary">上传文件</el-button>

                        </el-upload>
                </el-form-item>
               
                <el-form-item label="巡查次数">
                    <el-input-number v-model="form.inspectionWay"  style="width:100%" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="巡查类别:">
                    <el-select v-model="form.inspectionType" placeholder="请选择巡查类型" style="width:100%">
                         <el-option
                            v-for="dict in dict.type.sys_lamp_post_inspect_type"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="巡查道路">
                    <el-select v-model="form.road" style="width:100%" placeholder="请选择巡查道路">
                        <el-option
                            v-for="dict in dict.type.sys_road"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="form.inspectionAddress" placeholder="请输入详细地址"  style="width:100%"></el-input>
                </el-form-item>
                <el-form-item label="灯杆道路">
                    <el-select v-model="form.poleRoad" style="width:100%" placeholder="请选择巡查道路" @change="poleRoadChange">
                        <el-option
                            v-for="dict in dict.type.sys_road"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="关联灯杆">
                    <el-select filterable v-model="form.poleId" placeholder="请选择关联灯杆"  style="width:100%" @change="poleChange">
                        <el-option
                            v-for="dict in lampPostList"
                            :key="dict.id"
                            :label="dict.uid ? (dict.name + '(' + dict.uid + ')'): dict.name"
                            :value="dict.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="巡查单位:">
                    <treeselect v-model="form.inspectionCompany" :options="deptOptions" :normalizer="normalizer" placeholder="请选择巡查单位" />               

                </el-form-item>
                <el-form-item label="巡查人:">
                    <el-select v-model="form.inspectionUserId" placeholder="请选择巡查人"  style="width:100%">
                        <el-option
                                v-for="dict in inspectUserList"
                                :key="dict.userId"
                                :label="dict.nickName"
                                :value="dict.userId"/>
                    </el-select>
                </el-form-item>
               
            </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <show-map v-if="showMapState" :visible="showMapState" :lng="showMapLongitude" :lat="showMapLatitude" @close="showMapState = false"></show-map>

    </div>
</template>
<script>
import { getToken } from "@/utils/auth";

import { getConservePlanList,
         getDeviceList,
         addPlan,
         editPlan,
         getPlanDetail,
         deletePlan } from "@/api/lampPost";
import showMap from '@/components/show-map/index.vue'

import Treeselect from "@riophae/vue-treeselect";
import { listUser } from "@/api/system/user";
import { listDept } from "@/api/system/dept";

export default {
    dicts: ['sys_road','sys_roadside','sys_device_type', 'sys_lamp_post_inspect_type'],
    components:{
        showMap,
        Treeselect
    },
    data(){
        return {
            loading: false,
            total:0,
            queryParams:{
                pageNum:1,
                pageSize:20,
                status:'',
                time:[]
            },
            ids:[],
            list:[],
            dialogState:false,
            form:{
                planName:'',
                date:[],
                beginTime:'',
                endTime:'',
                inspectionWay:'',
                remark:'',
                inspectionType:'',
                road:'',
                inspectionAddress:'',
                poleId:'',
                uid:'',
                status:'',
                inspectionCompany: undefined,
                inspectionUserId:'',
                inspectionName:'',
                slpInspectionPlanImgList:[]
            },
            uploadList: [],
            uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload", // 上传文件服务器地址
            headers: {
                Authorization: "Bearer " + getToken(),
            },
            fileList: [],
            showMapState:false,
            showMapLongitude:'',
            showMapLatitude:'',
            lampPostList:[],
            deptOptions: [],
            inspectUserList:[]
        }
    },
    watch:{
        'form.inspectionCompany'(val){
            console.log(val)
            if (val) {
                listUser({
                    deptId:val,
                    pageNum:1,
                    pageSize:9999
                }).then(res => {
                    if (res.code == 200) {
                        this.$set(this, 'inspectUserList', res.rows || [])
                    }
                })
            }
        },
    },
    methods:{
        poleChange(val){
            if (val) {
                
            }
        },
        openDetail(row){
            getPlanDetail(row.id).then(res => {
                if (res.code == 0) {
                    this.$set(this, 'form', res.data)
                    this.$nextTick(() => {
                        this.dialogState = true
                    })
                }
            })
        },
        getStatusCn(status){
            let result = ''
            if (status == '0') {
                result = '未发布'
            }

            if (status == '1') {
                result = '执行中'
            }

            if (status == '2') {
                result = '已完成'
            }

            if (status == '99') {
                result = '取消'
            }

            return result
        },
        handleUpdate(id, status){
            editPlan({
                id,
                status
            }).then(res => {
                if (res.code == 200) {
                    this.$modal.msgSuccess("操作成功");
                    this.getList();
                }
            })
        },
        handleView(row){
            this.$router.push(`/lampPost/conserve/plan-history?id=${row.id}`)
        },
        submitForm(){
            this.$refs["form"].validate(valid => {
                if (valid) {
                    let form = JSON.parse(JSON.stringify(this.form))
                    if (form.date.length > 0) {
                        form.beginTime =  new Date(form.date[0]).getTime()
                        form.endTime = new Date(form.date[1]).getTime()

                    }
                    if (form.id ) {
                        editPlan(form).then(res => {
                            if (res.code === 200) {
                                this.$modal.msgSuccess("申请成功");
                                this.dialogState = false
                                this.getList();
                            }
                        })
                    } else {
                        addPlan(form).then(res => {
                            if (res.code === 200) {
                                this.$modal.msgSuccess("申请成功");
                                this.dialogState = false
                                this.getList();
                            }
                        })
                    }
                   
                }
            });
        },
        cancel(){
            this.dialogState = false
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
        poleRoadChange(val){
            if (val) {
                getDeviceList({
                    pageSize:99999,
                    pageNum:1,
                    road:val
                }).then(res => {
                    if (res.code == 200) {
                        this.$set(this, 'lampPostList', res.rows)
                    }
                })
            }
        },
        handleFileRemove(file, filelist){
            if (file.response.code == 200) {
                let index = null
                let fileUrl = file.response.data.url;
                this.form.slpInspectionPlanImgList.forEach((item,i) => {
                    if (fileUrl == item.imgUrl) {
                        index = i
                    }
                })

                if (index != null) {
                    this.form.slpInspectionPlanImgList.splice(index, 1)
                }
            }
        },
        handleFileSuccess(res, file, filelist){
            if (res.code == 200) {
                this.form.slpInspectionPlanImgList.push({ imgUrl: res.data.url})
            }
        },
        openMap(row){
            this.showMapLatitude = row.latitude
            this.showMapLongitude = row.longitude

            this.showMapState = true
        },
        handleQuery(){
             this.queryParams.pageNum = 1
            this.getList()
        },
        resetQuery(){

        },
        handleExport(){
             let queryParams ={
                inspectionStartTime:'',
                inspectionEndTime:'',
            }

            if (this.queryParams.time.length > 0) {
                queryParams.inspectionStartTime = new Date(this.queryParams.time[0]).getTime()
                queryParams.inspectionEndTime = new  Date(this.queryParams.time[1]).getTime()
            }
            this.download('/slp/slp/plan/export', {}, `device_${new Date().getTime()}.xlsx`) 
        },
        handleMultDelete(){
            if (this.ids.length == 0) {
                this.$modal.msgError("请选择需要删除的数据");
                return
            }

            this.$modal.confirm('是否确认删除该数据吗？').then(() => {
                return deletePlan(this.ids.join(','));
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        handleAdd(){
            this.dialogState = true
        },
        handleDelete(row){
            this.$modal.confirm('是否确认删除该数据吗？').then(function() {
                return deletePlan(row.id);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
        },
        getList(){
            let params = {
                pageNum: this.queryParams.pageNum,
                pageSize: this.queryParams.pageSize,
                startTime:'',
                endTime:'',
                status: this.queryParams.status
            }

            if (this.queryParams.time.length > 0) {
                params.startTime = this.queryParams.time[0]
                params.endTime = this.queryParams.time[1]
            }

            getConservePlanList(params).then(res => {
                if (res.code == 200) {
                    this.total = res.total
                    this.list = res.rows || []
                }
            })
        }
    },
    created(){
        this.initDept()
        this.getList()
    }
}
</script>
<style lang="scss">
.conserve-plan-list{
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

}
</style>
<template>
    <div class="app-container conserve-apply" style="background:#eee;height:calc(100vh - 50px)">
        <div class="h104">
            <el-form :model="queryParams" size="small" :inline="true">
                <el-form-item label="巡检地点" prop="road">
                    <el-select v-model="queryParams.road" placeholder="请选择巡检地点">
                        <el-option
                            v-for="dict in dict.type.sys_road"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="时间" prop="time">
                    <el-date-picker v-model="queryParams.time" 
                                    type="daterange"
                                    placeholder="请选择巡检时间"
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
                        <el-table-column label="巡检时间" align="center"  prop="inspectionTime"  />
                        <el-table-column label="内容描述" align="center"  prop="remark"  />
                        <el-table-column label="巡检单位" align="center"  prop="inspectionUserDept"  />
                        <el-table-column label="巡检人" align="center"  prop="inspectionUserName"  />
                        <el-table-column label="巡检地点" align="center"  prop="inspectionAddress"  >
                            <template slot-scope="scope">
                                <div style="display:flex;align-items:center">
                                    <div style="white-space:nowrap">{{scope.row.inspectionAddress}}</div>
                                    <i @click="openMap(scope.row)" style="font-size:16px;cursor: pointer;color:#1890ff" class="el-icon-location-information"></i>
                                </div>
                        </template>
                        </el-table-column>
                        <el-table-column label="巡检类别" align="center"  prop="inspectionTypeStr"  />
                        <el-table-column label="关联灯杆" align="center"  prop="poleInfo"  />
                        <el-table-column label="生成时间" align="center"  prop="createTime"  />
                        <el-table-column label="操作" align="center" >
                            <template slot-scope="scope">
                                
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
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="巡检单位:">
                    <treeselect v-model="form.inspectionDepartment" :options="deptOptions" :normalizer="normalizer" placeholder="请选择养护部门" />               

                </el-form-item>
                <el-form-item label="巡检人:">
                    <el-select v-model="form.inspectionUserId"  style="width:100%">
                        <el-option
                                v-for="dict in inspectUserList"
                                :key="dict.userId"
                                :label="dict.nickName"
                                :value="dict.userId"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="巡检类别:">
                    <el-select v-model="form.inspectionTypeStr"  style="width:100%">
                        <el-option
                            v-for="dict in dict.type.sys_lamp_post_inspect_type"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="计划名称">
                    <el-select v-model="form.planId" style="width:100%">
                        <el-option
                                v-for="dict in planList"
                                :key="dict.id"
                                :label="dict.planName"
                                :value="dict.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="内容描述">
                    <el-input type="textarea" placeholder="请输入内容描述" v-model="form.remark"  style="width:100%"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-upload
                        :headers="headers"
                        :action="uploadFileUrl"
                        :before-remove="handleFileRemove"
                        :on-success="handleFileSuccess"
                        :file-list="fileList">
                            <el-button size="small" type="primary">上传文件</el-button>
                        </el-upload>
                </el-form-item>
                <el-form-item label="巡检道路">
                    <el-select v-model="form.road"  style="width:100%">
                        <el-option
                            v-for="dict in dict.type.sys_road"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="form.address" placeholder="请输入详细地址"  style="width:100%"></el-input>
                </el-form-item>
                <el-form-item label="巡检时间">
                    <el-date-picker
                        v-model="form.time"
                        type="datetime"
                        style="width:100%"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="巡检时长">
                    <el-input v-model="form.maintainHour" placeholder="请输入巡检时长"></el-input>
                </el-form-item>
                <el-form-item label="灯杆道路">
                    <el-select v-model="form.poleRoad"  style="width:100%" @change="poleRoadChange">
                        <el-option
                            v-for="dict in dict.type.sys_road"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="关联灯杆">
                    <el-select filterable  v-model="form.poleId"  style="width:100%">
                        <el-option
                            v-for="dict in lampPostList"
                            :key="dict.id"
                            :label="dict.uid ?(dict.name + '(' + dict.uid + ')'): dict.name"
                            :value="dict.id"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
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

import {getConservePlanList, 
        getDeviceList,
        getConserveApplyList,
        deleteComserveApply,
        addComserveApply } from "@/api/lampPost";
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
                road:'',
                time:[]
            },
            ids:[],
            list:[],
            dialogState:false,
            form:{
                planId:'',
                remark:'',
                inspectionTypeStr:'',
                road:'',
                inspectionAddress:'',
                inspectionTime:'',
                maintainHour:'',
                poleId:'',
                uid:'',
                status:'',
                inspectionUserId:'',
                inspectionDepartment: undefined,
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
            planList:[],
            deptOptions: [],
            inspectUserList:[],
            lampPostList:[]
        }
    },
     watch:{
        'form.inspectionDepartment'(val){
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
        submitForm(){
             this.$refs["form"].validate(valid => {
                if (valid) {
                    let form = JSON.parse(JSON.stringify(this.form))
                        addComserveApply(form).then(res => {
                            if (res.code === 200) {
                                this.$modal.msgSuccess("操作成功");
                                this.dialogState = false
                                this.getList();
                            }
                        })
                    
                }
            });
        },
        cancel(){
            this.dialogState = false
        },
        openMap(row){
            this.showMapLatitude = row.latitude
            this.showMapLongitude = row.longitude

            this.showMapState = true
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
        roadFormat(row) {
            return this.selectDictLabel(this.dict.type.sys_road, row.road);
        },
        handleQuery(){
            this.queryParams.pageSize = 1
            this.getList()
        },
        resetQuery(){

        },
        handleExport(){
            let queryParams ={
                startTime:'',
                endTime:'',
                road:this.queryParams.road
            }

            if (this.queryParams.time.length > 0) {
                queryParams.startTime = new Date(this.queryParams.time[0]).getTime()
                queryParams.endTime = new  Date(this.queryParams.time[1]).getTime()
            }
            this.download('/slp/slp/pole/report/export', queryParams, `device_${new Date().getTime()}.xlsx`) 

        },
        handleMultDelete(){
            if (this.ids.length == 0) {
                this.$modal.msgError("请选择需要删除的数据");
                return
            }

            this.$modal.confirm('是否确认删除该数据吗？').then(() => {
                return deleteComserveApply(this.ids.join(','));
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        handleAdd(){

            getConservePlanList({
                pageNum:1,
                pageSize:99999,
                status:1
            }).then(res => {
                if (res.code == 200) {
                    
                    this.$set(this, 'planList', res.rows)

                    this.dialogState = true
                }
            })
        },
        handleDelete(row){
            this.$modal.confirm('是否确认删除该数据吗？').then(function() {
                return deleteComserveApply(row.id);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
        },
        handleAdd(){

            getConservePlanList({
                pageNum:1,
                pageSize:99999,
                status:1
            }).then(res => {
                if (res.code == 200) {
                    res.rows = res.rows || []
                    res.rows.push({
                        id:undefined,
                        planName:'无'
                    })
                    this.$set(this, 'planList', res.rows)

                    this.dialogState = true
                }
            })
        },
        getList(){
            let params = {
                pageNum: this.queryParams.pageNum,
                pageSize: this.queryParams.pageSize,
                startTime:'',
                endTime:'',
                road: this.queryParams.road
            }

            if (this.queryParams.time.length > 0) {
                params.startTime = this.queryParams.time[0]
                params.endTime = this.queryParams.time[1]
            }

            getConserveApplyList(params).then(res => {
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
.conserve-apply{
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
<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="站点名称" prop="status">
                <el-input v-model="queryParams.name" placeholder="请输入站点名称"></el-input>
            </el-form-item>
            <el-form-item label="报警类型" prop="type">
                <el-select
                    v-model="queryParams.type"
                    placeholder="请选择报警类型"
                    clearable>
                     <el-option
                            v-for="dict in dict.type.sys_hydrops_warning_type"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                </el-select>
            </el-form-item>

            <el-form-item label="报警等级" prop="level">
                <el-select
                    v-model="queryParams.level"
                    placeholder="请选择报警等级"
                    clearable
                    @keyup.enter.native="handleQuery">
                     <el-option
                            v-for="dict in dict.type.sys_hydrops_warning_level"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                </el-select>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
           
            
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="handleMultDelete"
                >批量删除</el-button>
            </el-col>
             <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="handleExport"
                >导出</el-button>
            </el-col>
           
        </el-row>
        <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="index" label="序号" width="50" align="center" />

            <el-table-column label="设备名称" align="left"  prop="deviceName"  />
            
            <el-table-column label="报警类型" align="center" width="80" >
                <template slot-scope="scope">
                    <div>{{warningTypeFormat(scope.row)}}</div>
                </template>
            </el-table-column>
            <el-table-column label="报警等级" align="left" prop="warningLevelStr" width="200">
                <template slot-scope="scope">
                    <div>{{scope.row.warningLevelStr + scope.row.warningExtraInfo}}</div>
                </template>
            </el-table-column>
            <el-table-column label="报警描述" align="left" prop="warningContent"  ></el-table-column>
            <el-table-column label="报警时间" align="left" prop="createTime" width="160"></el-table-column>
            <el-table-column label="地点" align="left" width="200">
                <template slot-scope="scope">
                    <div style="display:flex;align-items:center">
                        <div style="white-space:nowrap">{{scope.row.address}}</div>
                        <i @click="openMap(scope.row)" style="font-size:16px;cursor: pointer;color:#1890ff" class="el-icon-location-information"></i>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="处理人" align="center" prop="handleUsername" />
            <el-table-column label="处理结果" align="center" >
                <template slot-scope="scope">
                    <div>{{handleResultFormat(scope.row)}}</div>
                </template>
            </el-table-column>
            <el-table-column label="处理时间" align="center" prop="handleTimeStr" />
            <el-table-column label="操作" align="center" >
                <template slot-scope="scope">
                    
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleView(scope.row)"
                    >详情</el-button>
                    <!-- <el-button
                        size="mini"
                        type="text"
                        @click="handleDelete(scope.row)"
                    >导出</el-button> -->
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleDelete(scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
            
        </el-table>
        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />
    
        <select-map v-if="mapDialog" :visible="mapDialog" :lng="form.longitude" :lat="form.latitude" @close="mapDialog = false" @add="addMarker"></select-map>
        <show-map v-if="showMapState" :visible="showMapState" :lng="showMapLongitude" :lat="showMapLatitude" @close="showMapState = false"></show-map>
        <detail :dialogShow="detailState" :id="detail_id" v-if="detailState" @close="detailState = false"></detail>

    </div>
</template>
<script>
import { getWarningHandleList,deleteWarning } from "@/api/hydrops";

import selectMap from '@/components/select-map/index.vue'
import showMap from '@/components/show-map/index.vue'

import detail from './component/detail.vue'


export default {
    dicts: ['sys_road','sys_roadside', 'sys_hydrops_warning_type', 'sys_hydrops_warning_handle', 'sys_hydrops_warning_level'],

    components:{
        selectMap,
        showMap,
        detail
    },
    data(){
        
        return {
            // 遮罩层
            loading: false,
            // 显示搜索条件
            showSearch: true,
            title:'',
            // 是否显示弹出层
            open: false,
            // 是否展开，默认全部折叠
            isExpandAll: false,
            // 重新渲染表格状态
            refreshTable: true,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                road: undefined,
                status: undefined,
                defencesStatus:''
            },
            ids:[],
            list:[],
            total:0,
            // 表单参数
            form: {
                id:'',
                name:'',
                road:'',
                type:'',
                address:'',
                typeName:'',
                roadSide:'',
                lightPoleId:'',
                uid:'',
                longitude:'',
                latitude:'',
                status:'',
                enable:'',
                installTime:'',
                removeTime:'',
                deviceCategory:'',
                installDepartment:'',
                installDepartmentName:'',
                installDepartmentPhone:'',
                maintainDepartment:'',
                maintainDepartmentName:'',
                maintainDepartmentPhone:'',
                propertyRightDepartment:'',
                propertyRightDepartmentName:'',
                propertyRightDepartmentPhone:'',
                defencesStatus:'',
                isDeleted:'',
                remark:''
            },
            rules:{

            },
            state:'',
            mapDialog:false,
            showMapState:false,
            showMapLongitude:'',
            showMapLatitude:'',
            detailState:false,
            detail_id:''
        }
    },
    methods:{
        openMap(row){
            this.showMapLatitude = row.latitude
            this.showMapLongitude = row.longitude

            this.showMapState = true
        },
        handleResultFormat(row) {
            return this.selectDictLabel(this.dict.type.sys_hydrops_warning_handle, row.handleResult);
        },
        roadSideFormat(row) {
            return this.selectDictLabel(this.dict.type.sys_roadside, row.roadSide);
        },
        roadFormat(row) {
            return this.selectDictLabel(this.dict.type.sys_road, row.road);
        },
        warningTypeFormat(row) {
            return this.selectDictLabel(this.dict.type.sys_hydrops_warning_type, row.warningType);
        },
        getEnableName(val){
            let result = ''

            if (val == '0') {
                result = '非启用'
            } else if (val == 1) {
                result = '启用'

            } else if (val == 2) {
                result = '移除'

            } 

            return result
        },
        addMarker(e){
            console.log(e)
            this.form.latitude = e.lat;
            this.form.longitude =  e.lng;
            this.mapDialog = false
        },
        handleView(row){
            this.detail_id = row.id;
            this.detailState = true
        },
        handleDownload(){
            
        },
        handleExport(){
            this.download('/slp/slp/monitor/video/export', {
                status:this.queryParams.status,
                road:this.queryParams.road,
            }, `device_${new Date().getTime()}.xlsx`) 
        },
        
        handleDelete(row){
            this.$modal.confirm('是否确认删除该数据吗？').then(function() {
                return deleteWarning(row.id);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        handleAdd(){
            this.open = true;
            this.state = 'add'
            this.title = "添加设备";
        },
        handleQuery(){
            this.queryParams.pageNum = 1;
            this.getList();
        },
        resetQuery(){
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 展开/折叠操作 */
        toggleExpandAll() {
            this.refreshTable = false;
            this.isExpandAll = !this.isExpandAll;
            this.$nextTick(() => {
                this.refreshTable = true;
            });
        },
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
        },
        handleMultDelete(){
            if (this.ids.length == 0) {
                this.$modal.msgError("请选择需要删除的数据");
                return
            }

            this.$modal.confirm('是否确认删除该数据吗？').then(() => {
                return deleteWarning(this.ids.join(','));
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        getList(){
            getWarningHandleList(this.queryParams).then(res => {
                if (res.code == 200) {
                    this.list = res.rows;
                    this.total = res.total
                }
            })
        },
        
        reset(){
            this.form = {
                id:'',
                name:'',
                road:'',
                type:'',
                address:'',
                typeName:'',
                roadSide:'',
                uid:'',
                longitude:'',
                latitude:'',
                status:'',
                enable:'',
                installTime:'',
                removeTime:'',
                installDepartment:'',
                installDepartmentName:'',
                installDepartmentPhone:'',
                maintainDepartment:'',
                maintainDepartmentName:'',
                maintainDepartmentPhone:'',
                propertyRightDepartment:'',
                propertyRightDepartmentName:'',
                propertyRightDepartmentPhone:'',
                isDeleted:false
            };
            this.resetForm("form");

        }
    },
    created(){
        this.getList();
    }
}
</script>
<style lang="scss" scoped>
.section{
    box-sizing: border-box;
    background: #F8F8F8;
    padding-top: 24px;
    padding-left: 10px;
    padding-right: 24px;
    margin-bottom: 16px;
}
</style>
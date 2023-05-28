<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="站点名称" prop="status">
                <el-input v-model="queryParams.name"></el-input>
            </el-form-item>
            <el-form-item label="报警类型" prop="type">
                <el-select
                    v-model="queryParams.type"
                    placeholder="请输入报警类型"
                    clearable
                    @keyup.enter.native="handleQuery">

                </el-select>
            </el-form-item>

            <el-form-item label="报警等级" prop="level">
                <el-select
                    v-model="queryParams.level"
                    placeholder="请输入报警类型"
                    clearable
                    @keyup.enter.native="handleQuery">

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
                    @click="handleAdd"
                >批量处理</el-button>
            </el-col>
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

            <el-table-column label="设备名称" align="center"  prop="name"  />
            
            <el-table-column label="报警类型" align="center" prop="type" />
            <el-table-column label="报警等级" align="center" prop="uid" />
            <el-table-column label="报警描述" align="center"  >
                <template slot-scope="scope">
                    <div>{{scope.row.status == 1 ? '正常' : '非正常'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="报警时间" align="center" >
                <template slot-scope="scope">
                    <div>{{getEnableName(scope.row.enable)}}</div>
                </template>
            </el-table-column>
            <el-table-column label="地点" align="center" prop="installTime" />
          
            <el-table-column label="操作" align="center" >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleUpdate(scope.row)"
                    >处理</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleDelete(scope.row)"
                    >派单</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleView(scope.row)"
                    >详情</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleDelete(scope.row)"
                    >导出</el-button>
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
        <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="140px">
                <div class="section">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item prop="name" label="序号">
                                <span>积水设备</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="name" label="设备名称">
                                <span>{{form.name}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="type" label="报警次数">
                              <span></span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="设备类型">
                              <span></span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="报警类型">
                              <span></span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="报警等级">
                              <span></span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="设备型号">
                              <span></span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="设备UID">
                              <span></span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="报警时间">
                              <span></span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="所属道路">
                              <span></span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="设备状态">
                              <span></span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="道路侧向">
                              <span></span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item prop="uid" label="详细地址">
                              <span></span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item prop="uid" label="报警描述">
                              <span></span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <select-map v-if="mapDialog" :visible="mapDialog" :lng="form.longitude" :lat="form.latitude" @close="mapDialog = false" @add="addMarker"></select-map>
    </div>
</template>
<script>
import { getDeviceList,
         getDeviceDetail,
         editDevice,
         addDevice,
         deleteDevice } from "@/api/video";

import selectMap from '@/components/select-map/index.vue'

export default {
    components:{
        selectMap
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
            mapDialog:false
        }
    },
    methods:{
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
            getDeviceDetail(row.id).then(res => {
                this.$set(this, 'form', res.data);
                this.state = 'view'
                this.open = true
            })
        },
        handleDownload(){
            
        },
        handleExport(){
            this.download('/slp/slp/monitor/video/export', {
                status:this.queryParams.status,
                road:this.queryParams.road,
            }, `device_${new Date().getTime()}.xlsx`) 
        },
        handleUpdate(row){
            getDeviceDetail(row.id).then(res => {
                this.$set(this, 'form', res.data);
                this.state = 'update'
                this.open = true
            })
        },
        handleDelete(row){
            this.$modal.confirm('是否确认删除该数据吗？').then(function() {
                return deleteDevice(row.id);
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

            this.$modal.confirm('是否确认删除该数据吗？').then(function() {
                return deleteDevice(this.ids.join(','));
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        getList(){
            getDeviceList(this.queryParams).then(res => {
                if (res.code == 200) {
                    this.list = res.rows;
                    this.total = res.total
                }
            })
        },
        submitForm(){
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id) {
                        editDevice(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addDevice(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        cancel(){
            this.reset();
            this.open = false
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
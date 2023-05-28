<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="菜单状态" clearable>
                    <!-- <el-option
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    /> -->
                    <el-option label="非正常" :value="0"></el-option>
                    <el-option label="正常" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="道路" prop="road">
                <el-input
                    v-model="queryParams.road"
                    placeholder="请输入导入"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
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
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                >新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="handleAdd"
                >批量导入</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="handleDownload"
                >导入模版下载</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="handleExport"
                >导出</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="handleMultDelete"
                >批量删除</el-button>
            </el-col>

        </el-row>
        <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="设备名称" align="center"  prop="name"  />
            <el-table-column label="设备型号" align="center" prop="type" />
            <el-table-column label="设备UID" align="center" prop="uid" />
            <el-table-column label="设备状态" align="center"  >
                <template slot-scope="scope">
                    <div>{{scope.row.status == 1 ? '正常' : '非正常'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="安装时间" align="center" prop="installTime" />
            <el-table-column label="所在街道" align="center" prop="road" />
            <el-table-column label="详细地址" align="center" prop="address" />
            <el-table-column label="GPS坐标" align="center"  >
                <template slot-scope="scope">
                    <div>经度:{{scope.row.longitude}},纬度:{{scope.row.latitude}}</div>
                </template>
            </el-table-column>
            <el-table-column label="道路侧向" align="center" prop="roadSide" />
            <el-table-column label="操作" align="center" >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleUpdate(scope.row)"
                    >编辑</el-button>
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
        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="140px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="name" label="设备名称">
                            <el-input v-model="form.name" :disabled="state == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="road" label="所在道路">
                            <el-input v-model="form.road" :disabled="state == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="type" label="设备型号">
                            <el-input v-model="form.type" :disabled="state == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="address" label="详细地址">
                            <el-input v-model="form.address" :disabled="state == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="uid" label="设备编号UID">
                            <el-input v-model="form.uid" :disabled="state == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="roadSide" label="道路侧向">
                            <el-input v-model="form.roadSide"  :disabled="state == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="status" label="状态" :disabled="true">
                            <el-select v-model="form.status">
                                <el-option label="非正常" :value="0"></el-option>
                                <el-option label="正常" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="longitude" label="经度">
                            <el-input v-model="form.longitude" :disabled="state == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="enable" label="是否启用">
                            <el-select v-model="form.enable" style="width:100%"  :disabled="state == 'view'">
                                <el-option label="非启用" :value="0"></el-option>
                                <el-option label="启用" :value="1"></el-option>
                                <el-option label="移除" :value="2"></el-option>

                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="latitude" label="维度">
                            <el-input v-model="form.latitude"  :disabled="state == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item prop="installTime" label="安装时间">
                            <el-date-picker v-model="form.installTime" 
                                            type="date"
                                            :disabled="state == 'view'"
                                            value-format="yyyy-MM-dd" ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="form.enable === 2">
                        <el-form-item prop="removeTime" label="移除时间">
                            <el-date-picker v-model="form.removeTime" 
                                            type="date"
                                            :disabled="state == 'view'"
                                            value-format="yyyy-MM-dd" ></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-divider content-position="left">安装情况</el-divider>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="installDepartment" label="安装部门">
                            <el-input v-model="form.installDepartment"  :disabled="state == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人及联系方式">
                            <div class="flex">
                                <el-input v-model="form.installDepartmentName"  :disabled="state == 'view'"></el-input>
                                <el-input v-model="form.installDepartmentPhone"  :disabled="state == 'view'"></el-input>

                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="maintainDepartment" label="养护部门">
                            <el-input v-model="form.maintainDepartment"  :disabled="state == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人及联系方式">
                            <div class="flex">
                                <el-input v-model="form.maintainDepartmentName"  :disabled="state == 'view'"></el-input>
                                <el-input v-model="form.maintainDepartmentPhone"  :disabled="state == 'view'"></el-input>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="propertyRightDepartment" label="产权部门">
                            <el-input v-model="form.propertyRightDepartment"  :disabled="state == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人及联系方式">
                            <div class="flex">
                                <el-input v-model="form.propertyRightDepartmentName"  :disabled="state == 'view'"></el-input>
                                <el-input v-model="form.propertyRightDepartmentPhone"  :disabled="state == 'view'"></el-input>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注:">
                            <el-input v-model="form.remark"  :disabled="state == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getDeviceList,
         getDeviceDetail,
         editDevice,
         addDevice,
         deleteDevice,
         exportDevice } from "@/api/environment";

export default {
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
                status: undefined
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
                remark:''
            },
            rules:{

            },
            state:''
        }
    },
    methods:{
        handleDownload(){

        },
        handleExport(){
            this.download('/slp/slp/management/export', {
                status:this.queryParams.status,
                road:this.queryParams.road,
            }, `device_${new Date().getTime()}.xlsx`) 
        },
        handleView(row){
            getDeviceDetail(row.id).then(res => {
                this.$set(this, 'form', res.data);
                this.state = 'view'
                this.open = true
            })
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
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
                    <el-option label="异常" :value="0"></el-option>
                    <el-option label="正常" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="道路" prop="road">
                <el-select v-model="queryParams.road" placeholder="请选择道路" clearable>
                    <el-option
                        v-for="dict in dict.type.sys_road"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="视频分类" prop="deviceCategory">
                <el-select v-model="queryParams.deviceCategory" placeholder="请选择视频分类" clearable>
                    <el-option
                        v-for="dict in dict.type.sys_video_type"
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
            <el-table-column type="index" label="序号" width="50" align="center" />

            <el-table-column label="设备名称" align="center"  prop="name"  />
            <el-table-column label="分类" align="center" >
                <template slot-scope="scope">
                    <div>{{typeFormat(scope.row)}}</div>
                </template>
            </el-table-column>
            <el-table-column label="设备型号" align="center" prop="type" />
            <el-table-column label="设备UID" align="center" prop="uid" />
            <el-table-column label="设备状态" align="center"  >
                <template slot-scope="scope">
                    <div>{{scope.row.status == 1 ? '正常' : '异常'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="是否启用" align="center" >
                <template slot-scope="scope">
                    <div>{{getEnableName(scope.row.enable)}}</div>
                </template>
            </el-table-column>
            <el-table-column label="安装时间" align="center" prop="installTime" />
           
            <el-table-column label="所在道路" align="center" prop="road" >
                <template slot-scope="scope">
                    <div>{{roadFormat(scope.row)}}</div>
                </template>
            </el-table-column>

            <el-table-column label="详细地址" align="center" prop="address" width="320px">
                <template slot-scope="scope">
                    <div style="display:flex;align-items:center">
                        <div style="white-space:nowrap">{{scope.row.address}}</div>
                        <i @click="openMap(scope.row)" style="font-size:16px;cursor: pointer;color:#1890ff" class="el-icon-location-information"></i>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="GPS坐标" align="center" width="200px" >
                <template slot-scope="scope">
                    <div>
                        <span>经度:{{scope.row.longitude}}</span>
                        <br/>
                        <span>纬度:{{scope.row.latitude}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="180px" align="center"  >
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
        <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="140px">
                <div class="section">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item prop="name" label="设备类型">
                                <span>视频设备</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="name" label="设备名称">
                                <el-input placeholder="请输入设备名称" v-model="form.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="type" label="设备型号">
                                <el-input placeholder="请输入设备型号" v-model="form.type"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="设备UID">
                                <el-input placeholder="请输入设备UID" v-model="form.uid"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="lightPoleId" label="绑定灯杆">
                                <el-select placeholder="请选择灯杆" v-model="form.lightPoleId" style="width:100%"></el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="section">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item prop="road" label="所在道路">
                                <el-select v-model="form.road"  :disabled="state == 'view'" style="width:100%">
                                    <el-option
                                        v-for="dict in dict.type.sys_road"
                                        :key="dict.value"
                                        :label="dict.label"
                                        :value="dict.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="address" label="地理地址">
                                <el-input placeholder="请输入地理地址" v-model="form.address">
                                    <div slot="append" @click.stop="mapDialog = true">
                                        <div style="width:100%;height:100%">
                                            <i class="el-icon-location"></i>

                                        </div>
                                    </div>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="roadSide" label="道路侧向">
                                <el-select placeholder="请输入道路侧向" v-model="form.roadSide" style="width:100%">
                                     <el-option
                                        v-for="dict in dict.type.sys_roadside"
                                        :key="dict.value"
                                        :label="dict.label"
                                        :value="dict.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="longitude" label="经度">
                                <el-input placeholder="请输入经度" v-model="form.longitude"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="latitude" label="纬度">
                                <el-input placeholder="请输入纬度" v-model="form.latitude"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="section">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item prop="status" label="状态" :disabled="true">
                                <el-select v-model="form.status" style="width:100%">
                                    <el-option label="异常" :value="0"></el-option>
                                    <el-option label="正常" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="enable" label="是否启用">
                                <el-select v-model="form.enable" style="width:100%"  :disabled="state == 'view'">
                                    <el-option label="非启用" :value="0"></el-option>
                                    <el-option label="启用" :value="1"></el-option>
                                    <el-option label="移除" :value="2"></el-option>

                                </el-select>
                            </el-form-item>
                        </el-col>
                         <el-col :span="8">
                            <el-form-item prop="deviceCategory" label="分类">
                                <el-select placeholder="请选择分类" v-model="form.deviceCategory" style="width:100%">
                                    <el-option
                                        v-for="dict in dict.type.sys_video_type"
                                        :key="dict.value"
                                        :label="dict.label"
                                        :value="dict.value"
                                    />

                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="section">
                    <el-row>
                        
                        <el-col :span="8">
                            <el-form-item prop="installTime" label="安装时间">
                                <el-date-picker v-model="form.installTime" 
                                            type="datetime"
                                            placeholder="请选择安装时间"
                                            style="width:100%"
                                            :disabled="state == 'view'"
                                            value-format="yyyy-MM-dd hh:mm:ss" ></el-date-picker>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8" v-if="form.enable === 2">
                            <el-form-item prop="removeTime" label="移除时间">
                                <el-date-picker v-model="form.removeTime" 
                                            type="date"
                                            style="width:100%"
                                            :disabled="state == 'view'"
                                            value-format="yyyy-MM-dd" ></el-date-picker>
                                </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                
                <el-divider content-position="left">安装情况</el-divider>
                <div class="section">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="安装部门" prop="installDepartment">
                                <el-input placeholder="请输入安装部门"  v-model="form.installDepartment"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="养护部门" prop="maintainDepartment">
                                <el-input placeholder="请输入养护部门" v-model="form.maintainDepartment"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="产权部门" prop="propertyRightDepartment">
                                <el-input  placeholder="请输入产权部门" v-model="form.propertyRightDepartment"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系人及联系方式" prop="installDepartmentName">
                                <el-input placeholder="请输入联系人"  v-model="form.installDepartmentName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系人及联系方式" prop="maintainDepartmentName">
                                <el-input placeholder="请输入联系人" v-model="form.maintainDepartmentName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系人及联系方式" prop="propertyRightDepartmentName">
                                <el-input placeholder="请输入联系人" v-model="form.propertyRightDepartmentName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="" prop="installDepartmentPhone">
                                <el-input placeholder="请输入联系方式" v-model="form.installDepartmentPhone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="" prop="maintainDepartmentPhone">
                                <el-input placeholder="请输入联系方式" v-model="form.maintainDepartmentPhone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="" prop="propertyRightDepartmentPhone">
                                <el-input  placeholder="请输入联系方式" v-model="form.propertyRightDepartmentPhone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="备注" prop="remark">
                                <el-input placeholder="请输入备注" type="textarea" v-model="form.remark"></el-input>
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
        <show-map v-if="showMapState" :visible="showMapState" :lng="showMapLongitude" :lat="showMapLatitude" @close="showMapState = false"></show-map>
    
    </div>
</template>
<script>
import { getDeviceList,
         getDeviceDetail,
         editDevice,
         addDevice,
         deleteDevice } from "@/api/video";

import selectMap from '@/components/select-map/index.vue'
import showMap from '@/components/show-map/index.vue'

export default {
    dicts: ['sys_road','sys_roadside','sys_video_type'],

    components:{
        selectMap,
        showMap
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
                road: '',
                status: '',
                deviceCategory:''
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
            showMapLatitude:''
        }
    },
    methods:{
        openMap(row){
            this.showMapLatitude = row.latitude
            this.showMapLongitude = row.longitude

            this.showMapState = true
        },
        roadSideFormat(row) {
            return this.selectDictLabel(this.dict.type.sys_roadside, row.roadSide);
        },
        roadFormat(row) {
            return this.selectDictLabel(this.dict.type.sys_road, row.road);
        },
        typeFormat(row){
            return this.selectDictLabel(this.dict.type.sys_video_type, row.deviceCategory);

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
        getTypeName(val){
            let result = ''

            if (val == 1) {
                result = '公安'
            } else if (val == 2) {
                result = '交警'

            } else if (val == 3) {
                result = '市政'

            } else if (val == 99) {
                result = '其他'

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

            this.$modal.confirm('是否确认删除该数据吗？').then(() => {
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
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
                    @click="handleMultDispose"
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

            <el-table-column label="设备名称" align="left" width="150" prop="deviceName"  />
            
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
          
            <el-table-column label="操作" align="left" width="180" >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        v-if="scope.row.handleStatus == null"
                        @click="handleDispose(scope.row)"
                    >处理</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        v-if="scope.row.handleStatus == null"
                        @click="handleSendOrder(scope.row)"
                    >派单</el-button>
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
        <el-dialog title="详情" :visible.sync="open" width="1200px" append-to-body>
            <div>
                <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                    <div class="section" style="background:#fff">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item prop="name" label="序号">
                                    <span>{{detail.id}}</span>
                                </el-form-item>
                            </el-col>
                        <el-col :span="8">
                            <el-form-item prop="name" label="设备名称">
                                <span>{{detail.deviceName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="type" label="报警次数">
                              <span>{{detail.warningTimes}}次</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="设备类型">
                              <span>积水</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="报警类型">
                              <span>{{warningTypeFormat({warningType:detail.warningType})}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="报警等级">
                              <span>{{detail.warningLevelStr + ' ' + detail.warningExtraInfo}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="设备型号">
                              <span>{{detail.pondingMonitor.type}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="设备UID">
                              <span>{{detail.deviceUid}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="报警时间">
                              <span>{{detail.createTime}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="所属道路">
                              <span>{{roadFormat({road:detail.pondingMonitor.road})}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="设备状态">
                              <span>{{getEnableName(detail.pondingMonitor.enable)}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="uid" label="道路侧向">
                              <span>{{roadSideFormat({roadSide:detail.pondingMonitor.roadSide})}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item prop="uid" label="详细地址">
                                <div style="display:flex;align-items:center">
                                    <div style="white-space:nowrap">{{detail.address}}</div>
                                    <i @click="openMap(detail)" style="font-size:16px;cursor: pointer;color:#1890ff" class="el-icon-location-information"></i>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item prop="uid" label="报警描述">
                              <span>{{detail.warningContent}}</span>
                            </el-form-item>
                        </el-col>
                        </el-row>
                    </div>

                </el-form>
                <div class="section" v-if="detail.handleStatus == null" style="box-sizing:border-box;padding:24px">
                    <div style="margin-bottom:24px">
                        <el-radio-group v-model="auditType" >
                            <el-radio label="1">处理</el-radio>
                            <el-radio label="2">派单</el-radio>

                        </el-radio-group>
                    </div>
                    
                    <div v-if="auditType == 1">
                        <el-form label-width="120px">
                            <el-form-item label="报警处理:">
                                <el-select v-model="disposeForm.handleResult" placeholder="请选择报警处理">
                                    <el-option
                                        v-for="dict in dict.type.sys_hydrops_warning_handle"
                                        :key="dict.value"
                                        :label="dict.label"
                                        :value="dict.value"
                                    />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="警报处理描述:">
                                <el-input v-model="disposeForm.handleDescription" type="textarea" placeholder="请输入警报处理描述"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="auditType == 2">
                        <el-form label-width="120px">
                            <el-form-item label="完成期限:">
                                <el-date-picker v-model="sendOrderForm.expectedFinishTime" 
                                        type="date"
                                        placeholder="请选择完成期限"
                                        style="width:100%"
                                        value-format="yyyy-MM-dd" ></el-date-picker>
                            </el-form-item>
                            <el-form-item label="派单部门:">
                                <treeselect v-model="sendOrderForm.handleDeptId" :options="deptOptions" :normalizer="normalizer" placeholder="请选择审核部门" />               
                            </el-form-item>
                            <el-form-item label="派单人员:">
                                <el-select v-model="sendOrderForm.handleUserId" placeholder="请选择部门" style="width:100%">
                                    <el-option
                                        v-for="dict in handleUserList"
                                        :key="dict.userId"
                                        :label="dict.nickName"
                                        :value="dict.userId"/>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="是否复核">
                                <el-select v-model="sendOrderForm.needCheck" style="width:100%">
                                    <el-option label="是" value="1" />
                                    <el-option label="否" value="0" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="复核部门:" v-if="sendOrderForm.needCheck == 1">
                                <treeselect v-model="sendOrderForm.checkDeptId" :options="deptOptions" :normalizer="normalizer" placeholder="请选择审核部门" />               
                            </el-form-item>
                            <el-form-item label="复核人员:" v-if="sendOrderForm.needCheck == 1">
                                <el-select v-model="sendOrderForm.checkUserId" placeholder="请选择部门" style="width:100%">
                                    <el-option
                                        v-for="dict in handleUserList"
                                        :key="dict.userId"
                                        :label="dict.nickName"
                                        :value="dict.userId"/>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="报警处理" :visible.sync="disposeState" width="512px">
            <el-form ref="disposeForm" :model="disposeForm" label-width="120px">
                <el-form-item label="序号:">
                    <span>{{detail.id}}</span>
                </el-form-item>
                <el-form-item label="设备名称:">
                    <span>{{detail.deviceName}}</span>
                </el-form-item>
                <el-form-item label="报警类型:">
                    <span>{{warningTypeFormat({warningType:detail.warningType})}}</span>
                </el-form-item>
                <el-form-item label="报警等级:">
                    <span>{{detail.warningLevelStr + ' ' + detail.warningExtraInfo}}</span>
                </el-form-item>
                <el-form-item label="报警水平:">
                    <span>{{detail.waterLevel + 'cm'}}</span>
                </el-form-item>
                <el-form-item label="报警处理:">
                    <el-select v-model="disposeForm.handleResult" placeholder="请选择报警处理" style="width:100%">
                        <el-option
                            v-for="dict in dict.type.sys_hydrops_warning_handle"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="警报处理描述:">
                    <el-input v-model="disposeForm.handleDescription" type="textarea" placeholder="请输入警报处理描述"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDispose">确 定</el-button>
                <el-button @click="disposeState = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="批量处理" :visible.sync="multDisposeState" width="512px">
            <el-form ref="disposeForm" :model="disposeForm" label-width="120px">
                <el-form-item label="序号:">
                    <span>{{ids.join(',')}}</span>
                </el-form-item>
                
                <el-form-item label="报警处理:">
                    <el-select v-model="disposeForm.handleResult" placeholder="请选择报警处理" style="width:100%">
                        <el-option
                            v-for="dict in dict.type.sys_hydrops_warning_handle"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="警报处理描述:">
                    <el-input v-model="disposeForm.handleDescription" type="textarea" placeholder="请输入警报处理描述"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitMultDispose">确 定</el-button>
                <el-button @click="multDisposeState = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="派单处理" :visible.sync="sendOrderState" width="512px">
            <el-form ref="sendOrderForm" :model="sendOrderForm" label-width="120px">
                <el-form-item label="序号:">
                    <span>{{detail.id}}</span>
                </el-form-item>
                <el-form-item label="设备名称:">
                    <span>{{detail.deviceName}}</span>
                </el-form-item>
                <el-form-item label="报警类型:">
                    <span>{{warningTypeFormat({warningType:detail.warningType})}}</span>
                </el-form-item>
                <el-form-item label="报警等级:">
                    <span>{{detail.warningLevelStr + ' ' + detail.warningExtraInfo}}</span>
                </el-form-item>
                <el-form-item label="报警描述:">
                    <span>{{detail.warningContent }}</span>
                </el-form-item>
                <el-form-item label="完成期限:">
                    <el-date-picker v-model="sendOrderForm.expectedFinishTime" 
                                    type="date"
                                    placeholder="请选择完成期限"
                                    style="width:100%"
                                    value-format="yyyy-MM-dd" ></el-date-picker>
                </el-form-item>
                <el-form-item label="派单部门:">
                    <treeselect v-model="sendOrderForm.handleDeptId" :options="deptOptions" :normalizer="normalizer" placeholder="请选择审核部门" />               
                </el-form-item>
                <el-form-item label="派单人员:">
                    <el-select v-model="sendOrderForm.handleUserId" placeholder="请选择部门" style="width:100%">
                            <el-option
                                v-for="dict in handleUserList"
                                :key="dict.userId"
                                :label="dict.nickName"
                                :value="dict.userId"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否复核">
                    <el-select v-model="sendOrderForm.needCheck" style="width:100%">
                        <el-option label="是" value="1" />
                        <el-option label="否" value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="复核部门:" v-if="sendOrderForm.needCheck == 1">
                    <treeselect v-model="sendOrderForm.checkDeptId" :options="deptOptions" :normalizer="normalizer" placeholder="请选择审核部门" />               
                </el-form-item>
                <el-form-item label="复核人员:" v-if="sendOrderForm.needCheck == 1">
                    <el-select v-model="sendOrderForm.checkUserId" placeholder="请选择部门" style="width:100%">
                            <el-option
                                v-for="dict in handleUserList"
                                :key="dict.userId"
                                :label="dict.nickName"
                                :value="dict.userId"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitSendOrder">确 定</el-button>
                <el-button @click="sendOrderState = false">取 消</el-button>
            </div>
        </el-dialog>

        <select-map v-if="mapDialog" :visible="mapDialog" :lng="form.longitude" :lat="form.latitude" @close="mapDialog = false" @add="addMarker"></select-map>
        <show-map v-if="showMapState" :visible="showMapState" :lng="showMapLongitude" :lat="showMapLatitude" @close="showMapState = false"></show-map>

    </div>
</template>
<script>
import { getWarningList,
         getWarningDetail,
         deleteWarning,
         warningHandle,
         warningCreateWorkOrder } from "@/api/hydrops";

import selectMap from '@/components/select-map/index.vue'
import showMap from '@/components/show-map/index.vue'

import { listDept } from "@/api/system/dept";
import { listUser } from "@/api/system/user";


import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
    dicts: ['sys_road','sys_roadside', 'sys_hydrops_warning_type', 'sys_hydrops_warning_handle', 'sys_hydrops_warning_level'],
    components:{
        selectMap,
        showMap,
        Treeselect
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
            selectList:[],
            list:[],
            total:0,
            // 表单参数
            form:{

            },
            detail: {
                id:'',
                pondingMonitor:{}
            },
            rules:{

            },
            state:'',
            mapDialog:false,
            showMapState:false,
            showMapLongitude:'',
            showMapLatitude:'',
            disposeState:false,
            disposeForm:{
                handleResult:'',
                handleDescription:'',
                
            },
            sendOrderState:false,
            sendOrderForm:{
                expectedFinishTime:'',
                needCheck:'',
                handleDeptId:undefined,
                handleUserId:'',
                checkDeptId:undefined,
                checkUserId:'',

            },
            handleUserList:[],
            checkUserList:[],
            deptOptions: [],
            auditType:'1',
            multDisposeState:false
        }
    },
    watch:{
        'sendOrderForm.handleDeptId'(val){
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
        'sendOrderForm.checkDeptId'(val){
            console.log(val)
            if (val) {
                listUser({
                    deptId:val,
                    pageNum:1,
                    pageSize:9999
                }).then(res => {
                    if (res.code == 200) {
                        this.$set(this, 'checkUserList', res.rows || [])
                    }
                })
            }
        },
    },
    methods:{
        handleMultDispose(){
            if (this.ids.length == 0) {
                this.$modal.msgError("请选择需要处理的数据");
                return
            }

            let flag = false

            this.selectList.forEach(item => {
                if (item.handleStatus != null) {
                    flag = true
                }
            })

            if (flag) {
                this.$modal.msgError("选择的数据中有已处理完的数据，请重新选择");
                return
            }

            this.multDisposeState = true

        },
        submitMultDispose(){
            this.$refs["disposeForm"].validate(valid => {
                if (valid) {
                    let form = JSON.parse(JSON.stringify(this.disposeForm))

                    form['idList'] = this.ids

                    warningHandle(form).then(res => {
                        if (res.code == 200) {
                            this.$modal.msgSuccess("处理成功");
                            this.multDisposeState = false
                            this.getList();
                        }
                    })
                }
            });
        },
        handleSendOrder(row){
            getWarningDetail({id:row.id}).then(res => {
                this.$set(this, 'detail', res.data);
                this.sendOrderState = true
            })
        },
        submitSendOrder(){
            this.$refs["sendOrderForm"].validate(valid => {
                if (valid) {
                    let form = JSON.parse(JSON.stringify(this.sendOrderForm))

                    form['relationId'] = this.detail.id

                    form.needCheck = form.needCheck == 1 ? true : false

                    warningCreateWorkOrder(form).then(res => {
                        if (res.code == 200) {
                            this.$modal.msgSuccess("派单成功");
                            this.sendOrderState = false
                            this.getList();
                        }
                    })
                }
            });
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
        handleDispose(row){
            getWarningDetail({id:row.id}).then(res => {
                this.$set(this, 'detail', res.data);
                this.disposeState = true
            })
        },
        submitDispose(){
            this.$refs["disposeForm"].validate(valid => {
                if (valid) {
                    let form = JSON.parse(JSON.stringify(this.disposeForm))

                    form['idList'] = [this.detail.id]

                    warningHandle(form).then(res => {
                        if (res.code == 200) {
                            this.$modal.msgSuccess("处理成功");
                            this.disposeState = false
                            this.getList();
                        }
                    })
                }
            });
        },
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
            getWarningDetail({id:row.id}).then(res => {
                this.$set(this, 'detail', res.data);
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
            getWarningDetail({id:row.id}).then(res => {
                this.$set(this, 'detail', res.data);
                this.state = 'update'
                this.open = true
            })
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
            this.selectList = selection;
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
            getWarningList(this.queryParams).then(res => {
                if (res.code == 200) {
                    this.list = res.rows;
                    this.total = res.total
                }
            })
        },
        submitForm(){
            if (this.auditType == 1) {
                let form = JSON.parse(JSON.stringify(this.disposeForm))

                form['idList'] = [this.detail.id]

                warningHandle(form).then(res => {
                    if (res.code == 200) {
                        this.$modal.msgSuccess("处理成功");
                        this.open = false
                        this.getList();
                    }
                })
            } else {
                let form = JSON.parse(JSON.stringify(this.sendOrderForm))

                form['relationId'] = this.detail.id

                form.needCheck = form.needCheck == 1 ? true : false

                warningCreateWorkOrder(form).then(res => {
                    if (res.code == 200) {
                        this.$modal.msgSuccess("派单成功");
                        this.open = false
                        this.getList();
                    }
                })
            }
        },
        cancel(){
            this.reset();
            this.open = false
        },
        reset(){
            this.detail = {
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
        this.initDept()
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
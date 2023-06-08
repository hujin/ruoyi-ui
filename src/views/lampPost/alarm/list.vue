<template>
    <div class="app-container alarm-list" style="background:#eee;height:calc(100vh - 50px)">
        <div class="h104">
            <el-form :model="queryParams" size="small" :inline="true">
                <el-form-item label="设备分类" prop="type">
                    <el-select v-model="queryParams.type" placeholder="请选择设备分类">
                        <el-option
                            v-for="dict in dict.type.sys_device_type"
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
            <div class="tab-header">
                <div class="tab-header-item" @click="handleTabItemClick(item.value)" :class="{active: item.value == active}" v-for="(item,index) in tabHeaderList" :key="index">{{item.text}}</div>
            </div>
            <div class="c-content">
                <div class="tool-row">
                    <el-button
                        type="primary"
                        icon="el-icon-plus"
                        size="mini"
                        @click="handleAdd"
                    >新增</el-button>
                    <el-button
                        type="primary"
                        plain
                        size="mini"
                        @click="handleMultDispose"
                        >批量处理</el-button>
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
                        <el-table-column label="序号" align="center" type="index" />
                        <el-table-column label="设备名称" align="center"  prop="deviceName"  />
                        <el-table-column label="设备类型" align="center"  prop="typeStr"  />
                         <el-table-column label="报警时间" align="center"  prop="createTime"  >
                            <template slot-scope="scope">
                                <div>{{new Date(scope.row.createTime).Format('yyyy-MM-dd')}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="报警类型" align="center"  prop="warningTypeStr"  />
                        <el-table-column label="报警描述" align="center"  prop="warningRemark"  />
                        <el-table-column label="历史报警次数" align="center"  prop="historyWarningCount"  />
                        <el-table-column label="报警来源" align="center"  prop="warningSourceStr"  />
                        <el-table-column label="报警分析" align="center"   >
                            <template slot-scope="scope">
                                <div style="color:#409EFE;cursor: pointer;" @click="handleAnalyse(scope.row)">查看</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="定位" align="center"  >
                            <template slot-scope="scope">
                                <div style="display:flex;align-items:center">
                                    <div style="white-space:nowrap">{{scope.row.address}}</div>
                                    <i @click="openMap(scope.row)" style="font-size:16px;cursor: pointer;color:#1890ff" class="el-icon-location-information"></i>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="left"  width="250">
                            <template slot-scope="scope">
                                
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleDispose(scope.row)"
                                >处理</el-button>
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleSendOrder(scope.row)"
                                >派单</el-button>
                                <!-- <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleUpdate(scope.row)"
                                >导出</el-button> -->
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleView(scope.row)"
                                >详情</el-button>
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleUpdate(scope.row)"
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
        <el-dialog title="新增报警" width="512px" :visible.sync="addState">
            <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="140px">
                <el-form-item label="申请人:">
                    <span>{{nickName}}</span>
                </el-form-item>

                <el-form-item label="灯杆道路:">
                    <el-select v-model="addForm.road" placeholder="请选择道路" style="width:100%" @change="roadChange">
                        <el-option
                                v-for="dict in dict.type.sys_road"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"/>
                    </el-select>

                </el-form-item>
                <el-form-item label="关联灯杆:">
                    <el-select v-model="addForm.poleId" placeholder="请选择灯杆编号" style="width:100%" @change="lampPostChange">
                         <el-option
                                v-for="dict in lampPostList"
                                :key="dict.id"
                                :label="dict.uid ?(dict.name + '(' + dict.uid + ')'): dict.name"
                                :value="dict.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="故障维修设备:">
                    <el-select v-model="addForm.uid" placeholder="请选择设备类型" style="width:100%" @change="deviceChange">
                       <el-option
                                v-for="dict in deviceList"
                                :key="dict.uid"
                                :label="dict.name"
                                :value="dict.uid"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="报警类型:">
                    <el-select v-model="addForm.warningType" placeholder="请选择报警类型" style="width:100%">
                        <el-option
                                v-for="dict in dict.type.sys_lamp_post_warning_type"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="内容描述:">
                    <el-input type="textarea" :rows="2" v-model="addForm.warningRemark" placeholder="请输入" style="width:100%"></el-input>
                </el-form-item>
                <el-form-item label="工单完成期限:">
                    <el-date-picker
                        v-model="addForm.finishTerm"
                        style="width:100%"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addState = false">取 消</el-button>
                <el-button type="primary" @click="submitAdd">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="处理" width="512px" :visible.sync="disposeState">
            <el-form ref="disposeForm" :model="disposeForm" label-width="140px">
                <el-form-item label="序号:">
                    <span>{{detail.id}}</span>
                </el-form-item>
                <el-form-item label="设备名称:">
                    <span>{{detail.poleName + detail.deviceName}}</span>
                </el-form-item>
                <el-form-item label="报警类型:">
                    <span>{{detail.warningTypeStr}}</span>
                </el-form-item>
                <el-form-item label="报警描述:">
                    <span>{{detail.warningRemark}}</span>
                </el-form-item>
                <el-form-item label="报警处理">
                    <el-select v-model="disposeForm.handleResultStatus" placeholder="请选择处理方式" style="width:100%">
                        <el-option
                                v-for="dict in dict.type.sys_lamp_post_warning_handle"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="报警处理描述:">
                    <el-input type="textarea" :rows="2" v-model="disposeForm.handleRemark" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
             <div slot="footer" class="dialog-footer">
                <el-button @click="disposeState = false">取 消</el-button>
                <el-button type="primary" @click="submitDispose">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="批量处理" width="512px" :visible.sync="multDisposeState">
            <el-form ref="multDisposeForm" :model="multDisposeForm" label-width="140px">
                <el-form-item label="序号:">
                    <span>{{ids.join(',')}}</span>
                </el-form-item>
               
                <el-form-item label="报警处理">
                    <el-select v-model="multDisposeForm.handleResultStatus" placeholder="请选择处理方式" style="width:100%">
                        <el-option
                                v-for="dict in dict.type.sys_lamp_post_warning_handle"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="报警处理描述:">
                    <el-input type="textarea" :rows="2" v-model="multDisposeForm.handleRemark" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="multDisposeState = false">取 消</el-button>
                <el-button type="primary" @click="batchAlarmHandleResult">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="派单" width="512px" :visible.sync="assignState">
            <el-form ref="assignForm" :model="assignForm" label-width="140px">
                <el-form-item label="序号:">
                    <span>{{detail.id}}</span>
                </el-form-item>
                <el-form-item label="设备名称:">
                    <span>{{detail.poleName + detail.deviceName}}</span>
                </el-form-item>
                <el-form-item label="报警类型:">
                    <span>{{detail.warningTypeStr}}</span>
                </el-form-item>
                <el-form-item label="报警描述:">
                    <span>{{detail.warningRemark}}</span>
                </el-form-item>
                <el-form-item label="报警设备:">
                    <span>{{detail.deviceName}}</span>
                </el-form-item>
                <el-form-item label="完成期限:">
                    <el-date-picker v-model="assignForm.expectedFinishTime" 
                                    type="date"
                                    placeholder="请选择完成期限"
                                    style="width:100%"
                                    value-format="yyyy-MM-dd" ></el-date-picker>
                </el-form-item>
                <el-form-item label="派单部门:">
                    <treeselect v-model="assignForm.handleDeptId" :options="deptOptions" :normalizer="normalizer" placeholder="请选择审核部门" />               
                </el-form-item>
                <el-form-item label="派单人员:">
                    <el-select v-model="assignForm.handleUserId" placeholder="请选择部门" style="width:100%">
                            <el-option
                                v-for="dict in handleUserList"
                                :key="dict.userId"
                                :label="dict.nickName"
                                :value="dict.userId"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否复核">
                    <el-select v-model="assignForm.needCheck" style="width:100%">
                        <el-option label="是" value="1" />
                        <el-option label="否" value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="复核部门:" v-if="assignForm.needCheck == 1">
                    <treeselect v-model="assignForm.checkDeptId" :options="deptOptions" :normalizer="normalizer" placeholder="请选择审核部门" />               
                </el-form-item>
                <el-form-item label="复核人员:" v-if="assignForm.needCheck == 1">
                    <el-select v-model="assignForm.checkUserId" placeholder="请选择部门" style="width:100%">
                            <el-option
                                v-for="dict in handleUserList"
                                :key="dict.userId"
                                :label="dict.nickName"
                                :value="dict.userId"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="assignState = false">取 消</el-button>
                <el-button type="primary" @click="submitAssign">确 定</el-button>
            </div>
        </el-dialog>
        <detail :dialogShow="detailState" :id="alarm_id" v-if="detailState" @close="detailState = false"></detail>
        <show-map v-if="showMapState" :visible="showMapState" :lng="showMapLongitude" :lat="showMapLatitude" @close="showMapState = false"></show-map>
        
    </div>
</template>
<script>

import detail from './component/detail.vue'
import { getAlarmList,
         getDeviceList,
         getAlarmDetail,
         addAlarm,
         deleteAlarm,
         alarmCreateWorkOrder,
         batchAlarmHandleResult} from "@/api/lampPost";

import showMap from '@/components/show-map/index.vue'

         
import { listDept } from "@/api/system/dept";
import { listUser } from "@/api/system/user";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
    dicts: ['sys_road','sys_roadside','sys_device_type', 'sys_audit_status','sys_lamp_post_warning_type','sys_lamp_post_warning_handle'],
    components:{
        detail,
        showMap,
        Treeselect,
    },
    data(){
        return {
            loading: false,
            active:0,
            tabHeaderList:[{
                text:'未处理',
                value:0
            },{
                text:'已派单',
                value:1
            },{
                text:'处理中',
                value:2
            },{
                text:'已处理',
                value:3
            }],
            total:0,
            queryParams:{
                pageNum:1,
                pageSize:20,
                time:[],
                type:'',
                status:0
            },
            ids:[],
            list:[],
            selectList:[],
            addState:false,
            addForm:{
                id:'',
                poleId:'',
                type:'',
                uid:'',
                road:'',
                warningType:'',
                finishTerm:'',
                warningRemark:''
            },
            addRules:{
                
            },
            disposeState:false,
            disposeForm:{
                handleResultStatus:'',
                handleRemark:''
            },
            multDisposeState:false,
            multDisposeForm:{
                handleResultStatus:'',
                handleRemark:''
            },
            assignState:false,
            assignForm:{
                relationId:'',
                expectedFinishTime:'',
                needCheck:'',
                handleDeptId:undefined,
                handleUserId:'',
                checkDeptId:undefined,
                checkUserId:'',
            },
            detailState:false,
            alarm_id:'',
            detail:{

            },
            lampPostList:[],
            deviceList:[],
            deptOptions: [],
            auditUserList:[],
            handleUserList:[],
            showMapState:false,
            showMapLongitude:'',
            showMapLatitude:'',
        }
    },
    watch:{
        'assignForm.handleDeptId'(val){
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
        'assignForm.checkDeptId'(val){
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
        
        batchAlarmHandleResult(){
            this.$refs["multDisposeForm"].validate(valid => {
                if (valid) {
                    let form = JSON.parse(JSON.stringify(this.multDisposeForm))
                    form['ids'] = this.ids
                    batchAlarmHandleResult(form).then(res => {
                        if (res.code == 200) {
                            this.$modal.msgSuccess("处理成功");
                            this.multDisposeState = false
                            this.getList();
                        }
                    })
                }
            });
        },
        handleDispose(row){
            getAlarmDetail(row.id).then(res => {
                this.$set(this, 'detail', res.data);
                this.disposeState = true
            })
        },
        handleSendOrder(row){
            getAlarmDetail(row.id).then(res => {
                this.$set(this, 'detail', res.data);
                this.assignState = true
            })
        },
        handleView(row){
            this.alarm_id = row.id
            this.detailState = true
        },
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
        handleAnalyse(row){

        },
        openMap(row){
            this.showMapLatitude = row.latitude
            this.showMapLongitude = row.longitude

            this.showMapState = true
        },
        roadChange(val){
            console.log(val)
            if (val) {
                this.getDeviceList(val)
            }
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
        },
        lampPostChange(val){
            console.log(val)
            if (val) {
                let device_list = []
                this.lampPostList.forEach(item => {
                    if (item.id == val){
                        device_list = item.slpOtherDeviceInfoList
                    }
                })

                this.$set(this, 'deviceList', device_list)
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
        deviceChange(val){
            if (val) {
                this.deviceList.forEach(item => {
                    if (item.uid == val) {
                        // this.auditForm.applyDevice = item.type
                    }
                })
            }
        },
        handleQuery(){

        },
        resetQuery(){

        },
        handleTabItemClick(val){
            if (val == this.active) {
                return;
            }
            this.queryParams.pageNum = 1
            this.active = val;
            this.queryParams.status = val
            this.getList()
        },
        handleAdd(){
            this.addState = true
        },
        handleMultDelete(){
            if (this.ids.length == 0) {
                this.$modal.msgError("请选择需要删除的数据");
                return
            }

            this.$modal.confirm('是否确认删除该数据吗？').then(() => {
                return deleteAlarm(this.ids.join(','));
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        handleDelete(row){
            this.$modal.confirm('是否确认删除该数据吗？').then(function() {
                return deleteAlarm(row.id);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        handleExport(){

        },
        getList(){
            this.loading = true

            let params  = {
                pageSize:this.queryParams.pageSize,
                pageNum:this.queryParams.pageNum,
                beginTime:'',
                endTime:'',
                type: this.queryParams.type,
                status:this.queryParams.status
            }
            if (this.queryParams.time.length > 0) {
                params.beginTime = new Date(this.queryParams.time[0]).Format('yyyy-MM-dd')
                params.endTime = new Date(this.queryParams.time[1]).Format('yyyy-MM-dd')
            }
            getAlarmList(params).then(res => {
                this.loading = false

                if (res.code == 200) {
                    this.$set(this, 'list', res.rows)
                    this.total = res.total
                }
            })
        },
        handleSelectionChange(selection) {
            this.selectList = selection;
            this.ids = selection.map(item => item.id);
        },
        handleUpdate(){

        },
        submitAdd(){
            this.$refs["addForm"].validate(valid => {
                if (valid) {
                    let form = JSON.parse(JSON.stringify(this.addForm))

                    addAlarm(form).then(res => {
                        if (res.code == 200) {
                            this.$modal.msgSuccess("新增成功");
                            this.addState = false
                            this.getList();
                        }
                    })
                }
            });
        },
        submitDispose(){
            this.$refs["disposeForm"].validate(valid => {
                if (valid) {
                    let form = JSON.parse(JSON.stringify(this.disposeForm))

                    form['ids'] = [this.detail.id]
                    batchAlarmHandleResult(form).then(res => {
                        if (res.code == 200) {
                            this.$modal.msgSuccess("处理成功");
                            this.disposeState = false

                            this.getList();
                        }
                    })
                }
            });
        },
        submitMultDispose(){

        },
        submitAssign(){
             this.$refs["assignForm"].validate(valid => {
                if (valid) {
                    let form = JSON.parse(JSON.stringify(this.assignForm))

                    form['relationId'] = this.detail.id

                    form.needCheck = form.needCheck == 1 ? true : false

                    alarmCreateWorkOrder(form).then(res => {
                        if (res.code == 200) {
                            this.$modal.msgSuccess("派单成功");
                            this.assignState = false
                            this.getList();
                        }
                    })
                }
            });
        }
    },
    computed:{
        nickName(){
            console.log(this.$store.state.user)
            return this.$store.state.user.nickName
        }
    },
    created(){
        this.initDept()
        this.getList()
    }
}
</script>
<style lang="scss">
.alarm-list{
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

        .tab-header {
            height: 40px;
            width: 100%;
            display: flex;

            .tab-header-item {
                padding: 0 24px;
                height: 40px;
                background-color: #EBF1FF;
                margin-right: 8px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 3px 3px 0 0;
                font-size: 16px;
                font-weight: 400;
                color: #A2A9BC;
                cursor: pointer;

                &.active {
                    background-color: #fff;
                    color: #409EFE;
                }
            }
        }

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
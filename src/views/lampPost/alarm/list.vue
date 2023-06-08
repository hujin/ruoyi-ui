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
                        @click="handleAdd"
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
                        <el-table-column label="报警描述" align="center"  prop="name"  />
                        <el-table-column label="历史报警次数" align="center"  prop="name"  />
                        <el-table-column label="报警来源" align="center"  prop="name"  />
                        <el-table-column label="报警分析" align="center"  prop="name"  />
                        <el-table-column label="定位" align="center"  prop="name"  />
                        <el-table-column label="操作" align="left"  width="250">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleUpdate(scope.row)"
                                >编辑</el-button>
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleUpdate(scope.row)"
                                >处理</el-button>
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleUpdate(scope.row)"
                                >派单</el-button>
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleUpdate(scope.row)"
                                >导出</el-button>
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleUpdate(scope.row)"
                                >详情</el-button>
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleUpdate(scope.row)"
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
                    <el-select v-model="addForm.lampPostId" placeholder="请选择灯杆编号" style="width:100%" @change="lampPostChange">
                         <el-option
                                v-for="dict in lampPostList"
                                :key="dict.uid"
                                :label="dict.name"
                                :value="dict.uid"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="故障维修设备:">
                    <el-select v-model="addForm.device_id" placeholder="请选择设备类型" style="width:100%" @change="deviceChange">
                       <el-option
                                v-for="dict in deviceList"
                                :key="dict.uid"
                                :label="dict.name"
                                :value="dict.uid"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="报警类型:">
                    <el-select v-model="addForm.alarm_type" placeholder="请选择报警类型" style="width:100%"></el-select>
                </el-form-item>
                <el-form-item label="内容描述:">
                    <el-input type="textarea" :rows="2" v-model="addForm.remark" placeholder="请输入" style="width:100%"></el-input>
                </el-form-item>
                <el-form-item label="工单完成期限:">
                    <el-date-picker
                        v-model="addForm.time"
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
                    <span>{{disposeForm.no}}</span>
                </el-form-item>
                <el-form-item label="设备名称:">
                    <span>{{disposeForm.device_name}}</span>
                </el-form-item>
                <el-form-item label="报警类型:">
                    <span>{{disposeForm.alarm_type}}</span>
                </el-form-item>
                <el-form-item label="报警描述:">
                    <span>{{disposeForm.remark}}</span>
                </el-form-item>
                <el-form-item label="报警处理">
                    <el-select v-model="disposeForm.dispose" placeholder="请选择处理方式"></el-select>
                </el-form-item>
                <el-form-item label="报警处理描述:">
                    <el-input type="textarea" :rows="2" v-model="disposeForm.dispose_remark" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
             <div slot="footer" class="dialog-footer">
                <el-button @click="disposeState = false">取 消</el-button>
                <el-button type="primary" @click="submitDispose">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="批量处理" width="512px" :visible.sync="multDisposeState">
            <el-form ref="disposeForm" :model="multDisposeForm" label-width="140px">
                <el-form-item label="序号:">
                    <span>{{multDisposeForm.no}}</span>
                </el-form-item>
               
                <el-form-item label="报警处理">
                    <el-select v-model="multDisposeForm.dispose" placeholder="请选择处理方式"></el-select>
                </el-form-item>
                <el-form-item label="报警处理描述:">
                    <el-input type="textarea" :rows="2" v-model="multDisposeForm.dispose_remark" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="multDisposeState = false">取 消</el-button>
                <el-button type="primary" @click="submitMultDispose">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="派单" width="512px" :visible.sync="assignState">
            <el-form ref="assignForm" :model="assignForm" label-width="140px">
                <el-form-item label="序号:">
                    <span>{{assignForm.no}}</span>
                </el-form-item>
                <el-form-item label="设备名称:">
                    <span>{{assignForm.device_name}}</span>
                </el-form-item>
                <el-form-item label="报警类型:">
                    <span>{{assignForm.alarm_type}}</span>
                </el-form-item>
                <el-form-item label="报警描述:">
                    <span>{{assignForm.remark}}</span>
                </el-form-item>
                <el-form-item label="报警设备:">
                    <span>{{assignForm.device_type}}</span>
                </el-form-item>
                <el-form-item label="完成期限:">
                    <el-date-picker
                        v-model="assignForm.assign_time"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="派单部门">
                    <el-select v-model="assignForm.assign_depart" placeholder="请选择"></el-select>
                </el-form-item>
                <el-form-item label="派单人员">
                    <el-select v-model="assignForm.assign_person" placeholder="请选择"></el-select>
                </el-form-item>
                <el-form-item label="是否符合">
                    <el-select v-model="assignForm.是否符合" placeholder="请选择"></el-select>
                </el-form-item>
                <el-form-item label="复核部门">
                    <el-select v-model="assignForm.re_check_depart" placeholder="请选择"></el-select>
                </el-form-item>
                <el-form-item label="复核人员">
                    <el-select v-model="assignForm.re_check_person" placeholder="请选择"></el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="assignState = false">取 消</el-button>
                <el-button type="primary" @click="submitAssign">确 定</el-button>
            </div>
        </el-dialog>
        <detail :dialogShow="detailState" :id="alarm_id" v-if="detailState"></detail>
        
    </div>
</template>
<script>

import detail from './component/detail.vue'
import { getAlarmList,
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
    dicts: ['sys_road','sys_roadside','sys_device_type', 'sys_audit_status','sys_lamp_post_warning_type'],
    components:{
        detail,
        Treeselect,
    },
    data(){
        return {
            loading: false,
            active:1,
            tabHeaderList:[{
                text:'未处理',
                value:1
            },{
                text:'已派单',
                value:2
            },{
                text:'处理中',
                value:3
            },{
                text:'已处理',
                value:4
            }],
            total:0,
            queryParams:{
                pageNum:1,
                pageSize:20,
                time:[],
                type:''
            },
            ids:[],
            list:[],
            addState:false,
            addForm:{
                road:'',
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
            addRules:{
                
            },
            disposeState:false,
            disposeForm:{
                no:'',
                device_name:'',
                alarm_type:'',
                remark:'',
                dispose:'',
                dispose_remark:''
            },
            multDisposeState:false,
            multDisposeForm:{
                no:'',
                dispose:'',
                dispose_remark:''
            },
            assignState:false,
            assignForm:{
                no:'',
                device_name:'',
                device_type:'',
                alarm_type:'',
                remark:'',
                assign_time:'',
                assign_depart:'',
                assign_person:'',
                is_re_check:false,
                re_check_depart:'',
                re_check_person:''
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
        }
    },
    methods:{
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
        handleQuery(){

        },
        resetQuery(){

        },
        handleTabItemClick(val){
            if (val == this.active) {
                return;
            }

            this.active = val;
        },
        handleAdd(){
            this.addState = true
        },
        handleMultDelete(){

        },
        handleExport(){

        },
        getList(){
            let params  = {
                pageSize:this.queryParams.pageSize,
                pageNum:this.queryParams.pageNum,
                startType:'DAY',
                beginTime:'',
                endTime:'',
                type: this.queryParams.type
            }
            if (this.queryParams.time.length > 0) {
                params.beginTime = new Date(this.queryParams.time[0]).Format('yyyy-MM-dd')
                params.endTime = new Date(this.queryParams.time[1]).Format('yyyy-MM-dd')
            }
            getAlarmList(params).then(res => {
                if (res.code == 200) {
                    this.$set(this, 'list', res.rows)
                    this.total = res.total
                }
            })
        },
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
        },
        handleUpdate(){

        },
        submitAdd(){

        },
        submitDispose(){

        },
        submitMultDispose(){

        },
        submitAssign(){

        }
    },
    computed:{
        nickName(){
            console.log(this.$store.state.user)
            return this.$store.state.user.nickName
        }
    },
    created(){
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
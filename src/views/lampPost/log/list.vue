<template>
    <div class="app-container alarm-list" style="background:#eee;height:calc(100vh - 50px)">
        <div class="h104">
            <el-form :model="queryParams" size="small" :inline="true">
                <el-form-item label="部门" prop="depart">
                    <el-select v-model="queryParams.type" placeholder="请选择部门">
                        
                    </el-select>
                </el-form-item>
                <el-form-item label="人员" prop="person">
                    <el-select v-model="queryParams.type" placeholder="请选择人员">
                        
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
                
                <div class="grid-wrap">
                    <el-table ref="tables" style="width:100%;height:100%" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center" />
                        <el-table-column label="操作时间" align="center"  prop="name"  />
                        <el-table-column label="操作单位" align="center"  prop="name"  />
                        <el-table-column label="操作人员" align="center"  prop="name"  />
                        <el-table-column label="操作类型" align="center"  prop="name"  />
                        <el-table-column label="灯杆编号" align="center"  prop="name"  />
                        <el-table-column label="设备型号" align="center"  prop="name"  />
                        <el-table-column label="设备UID" align="center"  prop="name"  />
                        <el-table-column label="所在道路" align="center"  prop="name"  />
                        <el-table-column label="道路侧向" align="center"  prop="name"  />
                        <el-table-column label="状态" align="center"  prop="name"  />
                        
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

        
    </div>
</template>
<script>


export default {
    dicts: ['sys_road','sys_roadside','sys_device_type'],
   
    data(){
        return {
            loading: false,
            active:1,
            tabHeaderList:[{
                text:'全部',
                value:1
            },{
                text:'绑定操作',
                value:2
            },{
                text:'删除操作',
                value:3
            },{
                text:'新增操作',
                value:4
            },{
                text:'编辑操作',
                value:5
            }],
            total:0,
            queryParams:{
                pageNum:1,
                pageSize:20,
                time:[],
                depart:'',
                person:''
            },
            ids:[],
            list:[],
            addState:false,
            addForm:{
                device_id:'',
                lamp_post_id:'',
                road:'',
                alarm_type:'',
                remark:'',
                time:''
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

            }
        }
    },
    methods:{
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
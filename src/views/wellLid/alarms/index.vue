<template>
    <div class="app-container alarms">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="报警类型" prop="warningType">
                <el-select v-model="queryParams.warningType" placeholder="报警类型" clearable>
                    <el-option
                        v-for="dict in dict.type.sys_welllid_warning_type"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="道路" prop="road">
                <el-select v-model="queryParams.road" placeholder="请选择道路">
                    <el-option
                        v-for="dict in dict.type.sys_road"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="井盖编号" prop="manholeCoverUid">
                <el-input
                    v-model="queryParams.manholeCoverUid"
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
            <div class="state">
                <div class="state-item">
                    <span>报警次数</span>
                    <span>{{totalWarning}}次</span>
                </div>
                <div class="state-item">
                    <span>已解除</span>
                    <span>{{handledWarning}}次</span>
                </div>
            </div>
        </el-row>
        <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="告警时间" align="center"  prop="warningTimeStr"  />
            <el-table-column label="告警解除时间" align="center" prop="warningCancelTimeStr" />
            <el-table-column label="井盖编号" align="center" prop="manholeCoverName" />
            <el-table-column label="报警时长" align="center"  prop="warningDuration"></el-table-column>
            <el-table-column label="所在道路" align="center" prop="road" />
            <el-table-column label="地点" align="center" prop="address" />
            <el-table-column label="报警类型" align="center" prop="warningType" >
                <template slot-scope="scope">
                    <div>{{getWarningTypeCn(scope.row.warningType)}}</div>
                </template>
            </el-table-column>
            <el-table-column label="报警内容" align="center" prop="warningContent" />
            <!-- <el-table-column label="操作" align="center" >
                <template slot-scope="scope">
                    
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleView(scope.row)"
                    >详情</el-button>
                   
                </template>
            </el-table-column> -->
            
        </el-table>
        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />
      
    </div>
</template>
<script>


import { getDeviceWarningList,getDeviceWarningCount,removeWarning } from "@/api/wellLid";

export default {
    dicts: ['sys_road','sys_roadside','sys_welllid_warning_type'],
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
                manholeCoverId: '',
                manholeCoverUid: '',
                warningType:''
            },
            ids:[],
            list:[],
            total:0,
           
            handledWarning:'',
            totalWarning:''
        }
    },
    methods:{
        roadFormat(row) {
            return this.selectDictLabel(this.dict.type.sys_road, row.road);
        },
        getWarningTypeCn(type){
            let result = '';

            if(type ==  'OVERFLOW') {
                result =  "满溢告警"
            }

            if(type ==  'OPEN') {
                result =  "打开告警"
            }

            if(type ==  'OFFLINE') {
                result =  "离线告警"
            }

            if(type ==  'LOSE') {
                result =  "丢失告警"
            }

            if(type ==  'LEAN') {
                result =  "偏移告警"
            }
            return result
        },
       
        handleExport(){
            this.download('/slp/slp/cover/warning/export', {
                status:this.queryParams.warningType,
                road:this.queryParams.road,
            }, `device_${new Date().getTime()}.xlsx`) 
        },    
        handleDelete(row){
            this.$modal.confirm('是否确认删除该数据吗？').then(function() {
                return removeWarning(row.id);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        handleMultDelete(){
            if (this.ids.length == 0) {
                this.$modal.msgError("请选择需要删除的数据");
                return
            }

            this.$modal.confirm('是否确认删除该数据吗？').then(()=> {
                return removeWarning(this.ids.join(','));
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch((e) => {
                console.log(e)
            });
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
       
        getList(){
            getDeviceWarningList(this.queryParams).then(res => {
                if (res.code == 200) {
                    this.list = res.rows;
                    this.total = res.total
                }
            })
        },
        getDeviceWarningCount(){
            getDeviceWarningCount(this.queryParams).then(res => {
                if (res.code === 200) {
                    this.totalWarning = res.data.totalWarning
                    this.handledWarning = res.data.handledWarning
                }
            })
        }
        
    },
    created(){
        if (this.$route.query.id) {
            this.queryParams.manholeCoverId = this.$route.query.id
        }
        this.getList();
        this.getDeviceWarningCount();
    }
}
</script>
<style lang="scss">
.alarms{
    .state{
        position: absolute;
        right: 0;
        bottom: 10px;
        display: flex;

        .state-item{
            width: 149px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            box-sizing: border-box;
            padding: 0 20px;
            border-radius: 4px;

            &:first-child{
                background: rgba(255,45,45,0.1);
                color: #FF2D2D;
            }

            &:last-child{
                background: rgba(5,167,94,0.1);
                color: #05A75E;
            }
        }

        .state-item + .state-item{
            margin-left: 16px;    
        }
    }
}
</style>
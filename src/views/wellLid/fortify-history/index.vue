<template>
    <div class="app-container fortify-history">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="操作" prop="action">
                <el-input v-model="queryParams.action" clearable></el-input>
            </el-form-item>
            <el-form-item label="道路" prop="road">
                <el-input
                    v-model="queryParams.road"
                    placeholder="请输入道路’"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
             <el-form-item label="操作人员" prop="operatorName">
                <el-input
                    v-model="queryParams.operatorName"
                    placeholder="请输入"
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
                    <span>设防设备</span>
                    <span>{{defencesOnCount}}个</span>
                </div>
                <div class="state-item">
                    <span>撤防设备</span>
                    <span>{{defencesOffCount}}个</span>
                </div>
            </div>
        </el-row>
        <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="时间" align="center"  prop="operationTimeStr"  />
            <el-table-column label="井盖名称" align="center" prop="manholeCoverName" />
            <el-table-column label="设备UID" align="center" prop="manholeCoverUid" />
            <el-table-column label="所在道路" align="center" prop="road" ></el-table-column>
            <el-table-column label="地点" align="center" prop="address" />
            <el-table-column label="操作" align="center"  >
                 <template slot-scope="scope">
                    <div>{{scope.row.action == 'ON' ? '设防' : '撤防'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作单位" align="center" prop="operatorDept" />
            <el-table-column label="操作人员" align="center" prop="operatorName" />
            <el-table-column label="联系方式" align="center" prop="operatorPhone" />
            <el-table-column label="设防/撤防时长" align="center" prop="defencesDuration" />            
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
import { getCoverLogList, 
         removeLog, 
         getDefences} from "@/api/wellLid";


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
                action: undefined,
                road: undefined,
                operatorName:'',
                operatorDept:'',
                manholeCoverId:''
            },
            ids:[],
            list:[],
            total:0,
           
            defencesOffCount:0,
            defencesOnCount:0
        }
    },
    methods:{

        handleExport(){
            this.download('/slp/slp/manhole/cover/defences/export', this.queryParams, `device_${new Date().getTime()}.xlsx`) 
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
                return removeLog(this.ids.join(','));
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        getList(){
            getCoverLogList(this.queryParams).then(res => {
                if (res.code == 200) {
                    this.list = res.rows;
                    this.total = res.total
                }
            })
        },
        
        getDefences(){
            getDefences().then(res => {
                if (res.code === 200) {
                    this.defencesOnCount = res.data.defencesOnCount
                    this.defencesOffCount = res.data.defencesOffCount
                }
            })
        }
    },
    created(){
        if (this.$route.query.id) {
            this.queryParams.manholeCoverId = this.$route.query.id
        }
        this.getDefences()
        this.getList();
    }
}
</script>
<style lang="scss">
.fortify-history{
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
                background: rgba(64,158,254,0.2);;
                color: #409EFE;
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
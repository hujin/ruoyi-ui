<template>
    <div class="app-container fortify-history">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="操作" prop="action">
                <el-select v-model="queryParams.action" placeholder="请选择操作">
                    <el-option
                        label="设防"
                        value="ON"
                    />
                    <el-option
                        label="撤防"
                        value="OFF"
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
                <el-button type="primary" :icon="seniorVisible ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" size="mini" @click="handleShowSenior">高级筛选</el-button>
            </el-form-item>
            <div style="margin-bottom:20px" class="searchSenior" v-if="seniorVisible">
                <div class="searchSenior_title">
                    高级筛选
                </div>
                <div>
                    <el-form-item label="操作单位" prop="unit">
                        <el-select v-model="queryParams.unit" placeholder="请选择操作单位">
                            <el-option
                                v-for="dict in dict.type.sys_device_type"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="时间" prop="time">
                        <el-date-picker 
                            v-model="queryParams.time" 
                            type="daterange"
                            placeholder="请选择时间"
                            style="width:250px"
                            value-format="yyyy-MM-dd" >
                        </el-date-picker>
                    </el-form-item>
                </div>
            </div>
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
            <el-table-column label="所在道路" align="center" prop="road" >
                <template slot-scope="scope">
                    <div>{{roadFormat(scope.row)}}</div>
                </template>
            </el-table-column>
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
    dicts: ['sys_road'],
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
            defencesOnCount:0,
            seniorVisible:false
        }
    },
    methods:{
        handleShowSenior(){
            this.seniorVisible = !this.seniorVisible
        },
        roadFormat(row) {
            return this.selectDictLabel(this.dict.type.sys_road, row.road);
        },
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

            this.$modal.confirm('是否确认删除该数据吗？').then(() => {
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
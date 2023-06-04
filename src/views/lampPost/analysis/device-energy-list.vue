<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="时间" prop="time">
                <el-date-picker
                    v-model="queryParams.time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
     
        <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="index" label="序号" width="50" align="center" />

            <el-table-column label="设备名称" align="center"  prop="name"  />
           
            <el-table-column label="所在道路" align="center" prop="road" />
            
            <el-table-column label="当前抄表数" align="center" prop="roadSide" />
            <el-table-column label="最新抄表时间" align="center" prop="roadSide" />

            <el-table-column label="操作" align="center" >
                <template slot-scope="scope">
                   
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleView(scope.row)"
                    >详情</el-button>
                   
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
        <el-dialog :title="title" :visible.sync="open" width="800px" >
            <div class="form-detail">
                <div class="list">
                    <div class="list-item">
                        <div class="name">当日能耗</div>
                        <div class="val">
                            <div class="num">129.72</div>
                            <div class="symbol">Kw·h</div>
                        </div>
                    </div>
                    <div class="list-item">
                        <div class="name">当月能耗</div>
                        <div class="val">
                            <div class="num">129.72</div>
                            <div class="symbol">Kw·h</div>
                        </div>
                    </div>
                    <div class="list-item">
                        <div class="name">当年能耗</div>
                        <div class="val">
                            <div class="num">129.72</div>
                            <div class="symbol">Kw·h</div>
                        </div>
                    </div>
                </div>
                <div class="table-wrap">
                    <el-table ref="tables" v-loading="loading" height="300" :data="list">
                        <el-table-column type="index" label="序号" width="50" align="center" />
                        <el-table-column label="抄表数" align="center"  prop="name"  />
                        <el-table-column label="抄表时间" align="center" prop="roadSide" />
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
                time:[],
            },
            ids:[],
            list:[],
            total:0,
            // 表单参数
            
           
            state:''
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

        handleView(row){
            getDeviceDetail(row.id).then(res => {
                this.$set(this, 'form', res.data);
                this.state = 'view'
                this.open = true
            })
        },
       
        
        handleQuery(){
            this.queryParams.pageNum = 1;
            this.getList();
        },
        resetQuery(){
            this.resetForm("queryForm");
            this.handleQuery();
        },
        
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
        },
       
        getList(){
            getDeviceList(this.queryParams).then(res => {
                if (res.code == 200) {
                    this.list = res.rows;
                    this.total = res.total
                }
            })
        },
        
        cancel(){
            this.reset();
            this.open = false
        },
        reset(){
            
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

.form-detail{
    .list{
        display: flex;
        justify-content: space-between;

        .list-item{
            width: 234px;
            height: 96px;
            border-radius: 4px;
            background-color: #f8f9fb;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .name{
                font-size: 16px;
                font-weight: 400;
                color: rgba(0,0,0,0.6);
                line-height: 22px;
                margin-bottom: 4px;
            }

            .val{
                display: flex;
                align-items: baseline;
                color: rgba(0,0,0,0.9);

                .num{
                    font-size: 30px;
                    
                    line-height: 38px;
                }

                .symbol{
                    font-size: 20px;
                    line-height: 38px;
                }
            }
        }
    }

    .table-wrap{
        width: 100%;
        height: 291px;
        margin-top: 24px;
    }
}
</style>
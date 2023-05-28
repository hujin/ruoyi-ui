<template>
    <div class="history">
        <div class="search-wrap">
            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            
           
                <el-form-item label="时间" prop="menuName">
                    <el-date-picker
                        v-model="queryParams.time"
                        value-format="yyyy-MM-dd"
                        type="datetimerange"
                        placeholder="时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-wrap">
            <div class="tool">
                <el-button type="primary">导出</el-button>
                <div class="text">历史最大水位：220cm    历史最大排水速度：150m²/h   历史最大积水时长：15天23时23分（432h）</div>
            </div>
            <el-table ref="tables" v-loading="loading" :data="list">
                <el-table-column label="时间" width="220" align="center" >
                    <template slot-scope="scope">
                        <div>{{new Date(scope.row.monitorTime).Format('yyyy-MM-dd hh:mm:ss')}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="当前水位cm"  prop="temp" align="center" >
                    <template slot-scope="scope">
                        <div>{{scope.row.temp + '°C'}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="排水速度cm²/min" prop="relativeHumidity" align="center" >
                    <template slot-scope="scope">
                        <div>{{scope.row.relativeHumidity + '%'}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="积水速度cm²/min"  prop="airPressure" align="center" >
                    <template slot-scope="scope">
                        <div>{{scope.row.airPressure + 'hpa'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="积水时长min" prop="rainfall" align="center" >
                <template slot-scope="scope">
                    <div>{{scope.row.rainfall + 'mm'}}</div>
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
        </div>
       
    </div>
</template>
<script>
import { getMonitorList } from "@/api/environment";

export default {
    props:{
        id:{
           type: Number 
        }
    },
    watch:{
       
        id:{
            handler(val){
                if (val) {
                    this.getList()
                }
            },
            immediate:true
        }
    },
    data(){
        return {
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                time: [],
                monitorTimeStart:'',
                monitorTimeEnd:'',
            },
            total:0,
            list:[],

            showSearch: true,
            loading: false,

        }
    },
    methods:{
        handleQuery(){
            this.queryParams.pageNum = 1;
            this.getList();
        },
        resetQuery(){
            this.queryParams.time = [];
            this.queryParams.monitorTimeStart = '';
            this.queryParams.monitorTimeEnd = ''
            this.queryParams.pageNum = 1;
            this.resetForm("queryForm");
            this.handleQuery();
        },
        getList(){
            let parmas = {
                stationId:this.id,
                pageNum:this.queryParams.pageNum,
                pageSize:this.queryParams.pageSize,
                monitorTimeStart:'',
                monitorTimeEnd:''
            }

            if (this.queryParams.time[0]) {
                parmas.monitorTimeStart = new Date(this.queryParams.time[0]).getTime()
                parmas.monitorTimeEnd = new Date(this.queryParams.time[1]).getTime()
            }



            getMonitorList(parmas).then(res => {
                if (res.code == 200) {
                    this.$set(this, 'list', res.data.rows);
                    this.total  = res.data.total
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.history{
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .search-wrap{
        padding: 32px 24px;
        padding-bottom: 14px;
        background-color: #fff;
        margin-bottom: 24px;
    }

    .table-wrap{
        flex: 1;
        height: 0;
        background-color: #fff;
        box-sizing: border-box;
        padding: 24px;

        .tool{
            display: flex;
            align-items: center;
            margin-bottom: 24px;

            .text{
                margin-left: 16px;
                font-size: 12px;
                font-weight: 400;
                color: #EB0E1D;

            }
        }
    }
}
</style>
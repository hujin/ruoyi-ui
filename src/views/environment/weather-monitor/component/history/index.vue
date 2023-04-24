<template>
    <div class="history">
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
        <el-table ref="tables" v-loading="loading" :data="list">
                    <el-table-column type="index" width="50" align="center" />
                        <el-table-column label="时间" width="220" align="center" >
                            <template slot-scope="scope">
                                <div>{{new Date(scope.row.monitorTime).Format('yyyy-MM-dd hh:mm:ss')}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="温度°C" width="120" prop="temp" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.temp + '°C'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="相对湿度%" width="120" prop="relativeHumidity" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.relativeHumidity + '%'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="气压hpa" width="120" prop="airPressure" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.airPressure + 'hpa'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="降雨量mm" width="120" prop="rainfall" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.rainfall + 'mm'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="辐射μT" width="120" prop="radiation" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.radiation + 'μT'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="紫外线W/㎡" width="120" prop="uv" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.uv + 'W/㎡'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="PM2.5ug/㎡" width="120" prop="pm" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.pm + 'ug/㎡'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="PM10ug/㎡" width="120" prop="pmTen" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.pmTen + 'ug/㎡'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="风向" width="120" prop="windDirection" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.windDirection}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="风速m/s" width="120" prop="windSpeed" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.windSpeed + '%' + ' ' + scope.row.windSpeedStr}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="海拔高度m" width="120" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.altitude }}</div>
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
    padding: 24px 19px;
}
</style>
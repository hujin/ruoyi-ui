<template>
    <div class="app-container alarm-history" style="background:#eee;height:calc(100vh - 50px)">
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
        <div class="chart-wrap">
            <div class="chart-container" v-show="chartShow">
                <div class="chart-1">
                    <div class="chart" id="chart1" ref="chart1"></div>
                </div>
                <div class="chart-1">
                    <div class="chart" id="chart2" ref="chart2"></div>
                </div>
                <div class="chart-2">
                    <div class="chart" id="chart3" ref="chart3"></div>
                </div>
            </div>
            <div class="chart-footer">
                <div class="chart-arrow" @click="toggleChart">
                    <span class="text">{{chartShow ? '向上收起' : '向下展开'}}</span>
                    <i class="el-icon-arrow-down"></i>
                </div>
            </div>
            
        </div>
        
        <div class="c-container">
            <div class="c-content">
                <div class="tool-row">
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
                        <el-table-column label="设备状态" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.status == 1 ? '正常' : '异常'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="设备类型" align="center"  prop="typeStr"  />
                        <el-table-column label="报警时间" align="center"  prop="createTime"  >
                            <template slot-scope="scope">
                                <div>{{new Date(scope.row.createTime).Format('yyyy-MM-dd')}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="报警类型" align="center"  prop="warningTypeStr"  />
                        <el-table-column label="次数" align="center"  prop="historyWarningCount"  />
                        <el-table-column label="来源" align="center"  prop="warningSource"  />
                        <el-table-column label="处理单位" align="center"  prop="handleUserDept"  />
                        <el-table-column label="定位" align="center"    >
                             <template slot-scope="scope">
                                <div style="display:flex;align-items:center">
                                    <div style="white-space:nowrap">{{scope.row.address}}</div>
                                    <i @click="openMap(scope.row)" style="font-size:16px;cursor: pointer;color:#1890ff" class="el-icon-location-information"></i>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="处理时间" align="center"  prop="handleTime"  >
                            <template slot-scope="scope">
                                <div>{{new Date(scope.row.handleTime).Format('yyyy-MM-dd')}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" >
                            <template slot-scope="scope">
                                
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
        <detail :dialogShow="detailShow" :id="alarm_id" v-if="detailShow" @close="detailShow = false"></detail>
        <show-map v-if="showMapState" :visible="showMapState" :lng="showMapLongitude" :lat="showMapLatitude" @close="showMapState = false"></show-map>

    </div>
</template>
<script>
import * as echarts from 'echarts'

import detail from './component/detail.vue'

import { getAlarmHistoryDashboard, getAlarmHistoryList } from "@/api/lampPost";

export default {
    dicts: ['sys_road','sys_roadside','sys_device_type'],
    components:{
        detail
    },
    data(){
        return {
            alarm_id:'',
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
            chartShow:true,
            chart1:null,
            yAxis1:[],
            chart2:null,
            yAxis2:[],
            chart3:null,
            xAxis3:[],
            yAxis3:[],

            detailShow:false,
            showMapState:false,
            showMapLongitude:'',
            showMapLatitude:'',
        }
    },
    methods:{
        openMap(row){
            this.showMapLatitude = row.latitude
            this.showMapLongitude = row.longitude

            this.showMapState = true
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
        handleQuery(){
            this.getAlarmHistoryDashboard()
        },
        resetQuery(){

        },
        initChart1(){
            var el = this.$refs['chart1'];
            this.chart1 = echarts.init(el);

            let option = {
                color: ['#6395F9','#6ADCAF','#F7C32D'],
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    bottom: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: '报警来源分布',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 40,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: this.yAxis1
                    }
                ]
            };
            this.chart1.setOption(option)
        },
        initChart2(){
            var el = this.$refs['chart2'];
            this.chart2 = echarts.init(el);

            let option = {
                color: ['#6395F9','#6ADCAF','#F7C32D','#FF9E88'],
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    bottom: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: '报警设备类型分布',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 40,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: this.yAxis2
                    }
                ]
            };
            this.chart2.setOption(option)
        },
        initChart3(){
            var el = this.$refs['chart3'];
            this.chart3 = echarts.init(el);

            let option = {
                tooltip:{
                    show:true,
                    trigger:'item'
                },
                color:['#6ADCAF','#6395F9','#F7C32D'],
                xAxis: {
                    type: 'category',
                    data: this.xAxis3
                },
                legend: {
                    top: '5%',
                    right: '20'
                },
                grid:{
                    bottom:35,
                    right:40
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: this.yAxis3[0],
                        name: '新增总数',
                        type: 'bar'
                    },
                    {
                        data: this.yAxis3[1],
                        name: '完成总数',
                        type: 'bar'
                    },
                    {
                        data: this.yAxis3[2],
                        name: '累积未处理总数',
                        type: 'bar'
                    }
                ]
            };

            this.chart3.setOption(option)

        },
        handleTabItemClick(val){
            if (val == this.active) {
                return;
            }

            this.active = val;
        },
        handleAdd(){
            
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
            getAlarmHistoryList(params).then(res => {
                if (res.code == 200) {
                    this.$set(this, 'list', res.rows)
                    this.total = res.total
                }
            })
        },
        handleSelectionChange(){
            
        },
        handleUpdate(){

        },
        toggleChart(){
            this.chartShow = !this.chartShow

            if (this.chartShow) {
                this.$nextTick(() => {

                        this.initChart1()
                        this.initChart2()
                        this.initChart3()
                    
                })
            }
        },
        getAlarmHistoryDashboard(){
            let params  = {
                startType:'DAY',
                beginTime:'',
                endTime:'',
                type: this.queryParams.type
            }
            if (this.queryParams.time.length > 0) {
                params.beginTime = new Date(this.queryParams.time[0]).Format('yyyy-MM-dd')
                params.endTime = new Date(this.queryParams.time[1]).Format('yyyy-MM-dd')
            }
            getAlarmHistoryDashboard(params).then(res => {
                if (res.code == 200) {
                    if (res.data) {
                        let yAxis1 = []
                        yAxis1.push({
                            name:'人工上报',
                            value:res.data.personnelWarningCount
                        })

                        yAxis1.push({
                            name:'系统上报',
                            value:res.data.systemWarningCount
                        })

                        yAxis1.push({
                            name:'巡查上报',
                            value:res.data.inspectionCount || 0
                        })

                        this.$set(this, 'yAxis1', yAxis1)
                        if (this.chartShow) {
                            this.$nextTick(() => {
                                this.initChart1()
                            })
                        }
                       

                        if (res.data.slpDeviceWarningTypeVoList){
                            let yAxis2 = []
                            
                            res.data.slpDeviceWarningTypeVoList.forEach(item => {
                                yAxis2.push({
                                    name:item.warningDeviceStr,
                                    value:item.warningCount
                                })
                            })

                            this.$set(this, 'yAxis2', yAxis2)
                            if (this.chartShow) {
                                this.$nextTick(() => {
                                    this.initChart2()
                                })
                            }
                        }

                        if (res.data.slpDeviceWarningReportFormsVoList) {
                            let xAxis3 = []
                            let yAxis3 = [[],[],[]]

                            res.data.slpDeviceWarningReportFormsVoList.forEach(item=> {
                                xAxis3.push(item.timeStr)
                                yAxis3[0].push(item.newAddCount)
                                yAxis3[1].push(item.finishCount)
                                yAxis3[2].push(item.notFinishCount)

                            })

                            this.$set(this, 'xAxis3', xAxis3)
                            this.$set(this, 'yAxis3', yAxis3)

                            if (this.chartShow) {
                                this.$nextTick(() => {
                                    this.initChart3()
                                })
                            }

                        }
                    } else {
                        this.chartShow = false
                    }
                }
            })
        }  
    },
    created(){
        this.getList()
        this.getAlarmHistoryDashboard()
    }
}
</script>
<style lang="scss">
.alarm-history{
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

    .chart-wrap{
        margin-bottom: 24px;

        .chart-container{
            height: 455px;
            width: 100%;
            background-color: #fff;
            display: flex;

            .chart{
                height: 100%;
                width: 100%;
            }

            .chart-1{
                flex: 1;
                height: 100%;
            }

            .chart-2{
                flex: 2;
            }
        }

        .chart-footer{
            position: relative;
            display: flex;
            justify-content: center;

            .chart-arrow{
                height: 42px;
                width: 212px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                font-weight: 400;
                color: rgba(0,0,0,0.6);
                background-color: #fff;

                i{
                    font-size: 16px;
                    margin-left: 10px;
                }
            }
        }
    }

    .c-container{
        flex: 1;
        height: 0;
        width: 100%;
        display: flex;
        flex-direction: column;

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
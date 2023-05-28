<template>
    <div class="app-container alarm-history" style="background:#eee;height:calc(100vh - 50px)">
        <div class="h104"></div>
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
                        <el-table-column label="序号" align="center"  prop="name"  />
                        <el-table-column label="设备名称" align="center"  prop="name"  />
                        <el-table-column label="设备状态" align="center"  prop="name"  />
                        <el-table-column label="设备类型" align="center"  prop="name"  />
                        <el-table-column label="报警时间" align="center"  prop="name"  />
                        <el-table-column label="报警类型" align="center"  prop="name"  />
                        <el-table-column label="次数" align="center"  prop="name"  />
                        <el-table-column label="来源" align="center"  prop="name"  />
                        <el-table-column label="处理单位" align="center"  prop="name"  />
                        <el-table-column label="定位" align="center"  prop="name"  />
                        <el-table-column label="处理时间" align="center"  prop="name"  />
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
        <detail :dialogShow="detailShow" :id="alarm_id" v-if="detailShow"></detail>
    </div>
</template>
<script>
import * as echarts from 'echarts'

import detail from './component/detail.vue'

export default {
    components:{detail},
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
                pageSize:20
            },
            ids:[],
            list:[],
            chartShow:false,
            chart1:null,
            chart2:null,
            detailShow:false
        }
    },
    methods:{
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
                        data: [
                            { value: 1048, name: '人工上报' },
                            { value: 735, name: '系统上报' },
                            { value: 580, name: '巡查上报' },
                        ]
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
                        data: [
                            { value: 1048, name: '路灯报警数' },
                            { value: 735, name: '集中控制报警器' },
                            { value: 580, name: '井盖报警数' },
                            { value: 580, name: '监控报警器' },
                        ]
                    }
                ]
            };
            this.chart2.setOption(option)
        },
        initChart3(){
            var el = this.$refs['chart3'];
            this.chart3 = echarts.init(el);

            let option = {
                color:['#6ADCAF','#6395F9','#F7C32D'],
                xAxis: {
                    type: 'category',
                    data: ['2022/1/1', '2022/1/2', '2022/1/3', '2022/1/4', '2022/1/5', '2022/1/6', '2022/1/7']
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
                        data: [120, 200, 120, 80, 70, 110, 130],
                        name: '新增总数',
                        type: 'bar'
                    },
                    {
                        data: [130, 220, 150, 50, 20, 112, 120],
                        name: '完成总数',
                        type: 'bar'
                    },
                    {
                        data: [110, 190, 170, 660, 40, 113, 100],
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
        }   
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
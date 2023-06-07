<template>
    <div class="app-container conserve-analysis-person" style="background:#eee;height:calc(100vh - 50px)">
        <div class="left">
            <div class="row">
                <div class="row-item">
                    <div class="label">巡查人员统计</div>
                    <div class="val">{{info.totalUser || 0}}个</div>
                </div>
                <div class="row-item">
                    <div class="label">月新增</div>
                    <div class="val">{{info.currentMonthIncrUser || 0}}个</div>
                </div>
            </div>
            <div class="chart-wrap">
                <div class="chart-title">新增人员趋势图</div>
                <div class="search" style="margin-top:20px">
                         <el-form :model="queryForm" size="small" :inline="true">
                            <el-form-item label="时间" prop="time">
                                <el-date-picker v-model="queryForm.time" 
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    style="width:100%"
                                    value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
                            </el-form-item>
                            <el-form-item prop="statType">
                                <el-radio-group v-model="queryForm.statType" >
                                    <el-radio-button label="本日"></el-radio-button>
                                    <el-radio-button label="本月"></el-radio-button>
                                    <el-radio-button label="本年"></el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-form>
                </div>
                <div class="chart-container">
                    <div class="chart" id="chart1" ref="chart1"></div>
                </div> 
            </div>
        </div>
        <div class="right">
           <div class="chart-wrap">
                <div class="chart-title">来源单位占比</div>
                <div class="chart-container">
                    <div class="chart" id="chart2" ref="chart2"></div>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'

import {getDeptUserStatOverviewVo, 
        getUserCreateStat } from "@/api/lampPost";

export default {
    data(){
        return {
            chart1:null,
            xAxis1:[],
            yAxis1:[],
            chart2:null,
            yAxis2:[],
            queryForm:{
                time:[],
                statType:'本月'
            },
            info:{
                currentMonthIncrUser:0,
                totalUser:0
            }
        }
    },
    methods:{
        initChart1(){
            var el = this.$refs['chart1'];
            this.chart1 = echarts.init(el);

            let option = {
                    color:['#6596F9'],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['2/20', '2/21', '2/22', '2/23', '2/24', '2/25', '2/26']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    grid:{
                        bottom:35,
                        right:20,
                        left:40,
                        top:40
                    },
                    series: [
                        {
                            data: [820, 932, 901, 934, 1290, 1330, 1320],
                            type: 'line',
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: 'rgba(101,150,249,0.4)' },
                                        { offset: 1, color: 'rgba(248,249,251,0.44)' }
                                ])
                            }
                        }
                    ]
            };

            this.chart1.setOption(option)

        },
        initChart2(){
            var el = this.$refs['chart2'];
            this.chart2 = echarts.init(el);

            let option = {
                tooltip: {
                    show:true
                },
                colors:['#F7C32D','#F1866D', '#61DEDD', '#6ADCAF', '#6395F9'],
                legend: {
                    top: 'bottom',
                    itemWidth:14,
                },
                
                series: [
                    {
                        name: '来源单位占比',
                        type: 'pie',
                        radius: [50, 120],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 0
                        },
                        data: this.yAxis2
                    }
                ]
            };

            this.chart2.setOption(option)

        },
        getDeptUserStatOverviewVo(){
            getDeptUserStatOverviewVo().then(res => {
                if (res.code == 200) {
                    this.info.currentMonthIncrUser = res.data.currentMonthIncrUser
                    this.info.totalUser = res.data.totalUser

                    if (res.data.deptUserStatList) {
                        let deptUserStatList = res.data.deptUserStatList
                        let yAxis2 = [];
                        
                        deptUserStatList.forEach(item => {
                            yAxis2.push({
                                value:item.percent,
                                name:item.name
                            })
                        })
                        
                        this.$set(this, 'yAxis2', yAxis2)
                        this.$nextTick(() => {
                            this.initChart2()
                        })
                    }   
                }
            })
        },
        getUserCreateStat(){
            let params = {
                startTime:'',
                endTime:'',
                statType:''
            }

            if (this.queryForm.time.length > 0) {
                params.startTime = new Date(this.queryForm.time[0]).getTime()
                params.endTime = new Date(this.queryForm.time[1]).getTime()
            }

            if (this.queryForm.statType == '本日') {
                params.statType = 'DAY'
            }

            if (this.queryForm.statType == '本月') {
                params.statType = 'MONTH'
            }

            if (this.queryForm.statType == '本年') {
                params.statType = 'YEAR'
            }

            getUserCreateStat(params).then(res => {
                if (res.code == 200) {

                }
            })
        }
    },
    mounted(){
        this.getDeptUserStatOverviewVo()
        this.getUserCreateStat()
        this.initChart1()
        this.initChart2()
    }
}
</script>
<style lang="scss">
.conserve-analysis-person{
    display: flex;
    
    .chart{
        width: 100%;
        height: 100%;
    }

    .left {
        flex: 1;
        width: 0;
        height: 100%;
        display: flex;
        flex-direction: column;

        .row{
            width: 100%;
            height: 100px;
            display: flex;
            margin-bottom: 24px;

            .row-item{
                flex: 1;
                height: 100%;
                border-radius: 5px;
                background-color: #fff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-sizing: border-box;
                padding: 0 24px;

                .label{
                    font-size: 18px;
                    font-weight: 400;
                    color: rgba(0,0,0,0.9);
                }

                .val{
                    font-size: 26px;
                    font-weight: 500;
                    color: rgba(0,0,0,0.9);
                }
            }

            .row-item + .row-item{
                margin-left: 16px;
            }
        }

        
    }

    .right{
        width: 460px;
        height: 100%;
        border-radius: 4px;
        background-color: #fff;
        margin-left: 24px;
        display: flex;
        flex-direction: column;
    }

    .chart-wrap{
        flex: 1;
        height: 0;
        width: 100%;
        border-radius: 4px;
        background-color: #fff;
        box-sizing: border-box;
        padding: 24px;
        display: flex;
        flex-direction: column;

        .chart-title{
            font-size: 20px;
            font-weight: 500;
            color: rgba(0,0,0,0.9);
            line-height: 28px;
        }

        .chart-container{
            flex: 1;
            height: 0;
            width: 100%;
        }
    }
}
</style>
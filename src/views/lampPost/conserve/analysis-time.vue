<template>
    <div class="app-container conserve-analysis-time" style="background:#eee;height:calc(100vh - 50px)">
        <div class="row">
            <div class="row-item">
                <div class="label">总巡查时间</div>
                <div class="val">{{info.inspectionHour}}小时</div>
            </div>
            <div class="row-item">
                <div class="label">总巡查次数</div>
                <div class="val">{{info.totalInspectionCount}}次</div>
            </div>
            <div class="row-item">
                <div class="label">高频巡查时间段</div>
                <div class="val">{{new Date(info.frequencyTime).Format('hh:ss')}}</div>
            </div>
        </div>
        <div class="c-content">
            <div class="left">
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
            <div class="left">
                <div class="chart-wrap">
                    <div class="chart-title">来源单位占比</div>
                    <div class="chart-container">
                        <div class="chart" id="chart2" ref="chart2"></div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
import { getReportTimeAndContent } from "@/api/lampPost";

import * as echarts from 'echarts'

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
                frequencyTime:'',
                inspectionHour:0,
                totalInspectionCount:0
            }
        }
    },
    methods:{
        initChart1(){
            var el = this.$refs['chart1'];
            this.chart1 = echarts.init(el);

            let option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    left: 'center',
                    bottom: 20,
                    itemWidth:14
                },
                xAxis:{
                    data:this.xAxis1
                },
                yAxis: {
                    type: 'value'
                },
                grid:{
                    left: 60,
                    right: 60,
                    bottom:35,
                },
                series: [
                   {
                    type:'bar',
                    data:this.yAxis1,
                    label: {
                        show: true,
                        position: 'top',
                        valueAnimation: true,
                        formatter:'{@score}'
                    },
                    // showBackground: true,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#6395F9' },
                            { offset: 1, color: 'rgba(99,149,249,0.05)' }
                        ])
                    },
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
        getReportTimeAndContent(){
             let params = {
                beginTime:'',
                beginTime:'',
                timeType:''
            }
            
            if (this.queryForm.time.length > 0) {
                params.startTime = new Date(this.queryForm.time[0]).getTime()
                params.endTime = new Date(this.queryForm.time[1]).getTime()
            }

            if (this.queryForm.statType == '本日') {
                params.timeType = '1'
            }

            if (this.queryForm.statType == '本月') {
                params.timeType = '2'
            }

            if (this.queryForm.statType == '本年') {
                params.timeType = '3'
            }

            getReportTimeAndContent(params).then(res => {
                if (res.code == 200) {
                    this.info.frequencyTime = res.data.frequencyTime
                    this.info.inspectionHour = res.data.inspectionHour
                    this.info.totalInspectionCount = res.data.totalInspectionCount

                    if (res.data.inspectionContentList) {
                        let inspectionContentList = res.data.inspectionContentList
                        let yAxis2 = []
                        inspectionContentList.forEach(item => {
                            yAxis2.push({
                                value:item.percent,
                                name: item.typeName
                            })
                        })

                        this.$set(this, 'yAxis2', yAxis2)
                        this.$nextTick(() => {
                            this.initChart2()
                        })
                    }

                    if (res.data.inspectionCountList) {
                        let inspectionCountList = res.data.inspectionCountList

                        let xAxis1 = []
                        let yAxis1 = []
                        inspectionCountList.forEach(item => {
                            if (params.timeType == '1') {
                                xAxis1.push(new Date(item.inspectionTime).Format('MM/dd'))

                            }
                            if (params.timeType == '2') {
                                console.log(new Date(item.inspectionTime), item)
                                xAxis1.push(new Date(item.inspectionTime).Format('MM'))

                            }

                            if (params.timeType == '3') {
                                xAxis1.push(new Date(item.inspectionTime).Format('yyyy'))

                            }

                            yAxis1.push(item.inspectionCount)
                        })
                        this.$set(this, 'xAxis1', xAxis1)
                        this.$set(this, 'yAxis1', yAxis1)

                        this.$nextTick(() => {
                            this.initChart1()
                        })

                    }
                }
            })
        }
    },
     mounted(){
        this.getReportTimeAndContent()
    }
}
</script>
<style lang="scss">
.conserve-analysis-time{
    display: flex;
    flex-direction: column;
    
    .chart{
        width: 100%;
        height: 100%;
    }

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

    .c-content{
        flex: 1;
        height: 0;
        width: 100%;
        display: flex;
    
    }

    .left {
        flex: 1;
        width: 0;
        height: 100%;
        display: flex;
        flex-direction: column;

    }

    .left + .left{
        margin-left: 24px;
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
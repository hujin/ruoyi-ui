<template>
    <div class="app-container conserve-analysis-person" style="background:#eee;height:calc(100vh - 50px)">
        <div class="left">
            <div class="row">
                <div class="row-item">
                    <div class="label">当月新增单位</div>
                    <div class="val">{{info.currentMonthDeptIncrNum || 0}}个</div>
                </div>
                <div class="row-item">
                    <div class="label">申报单位总计</div>
                    <div class="val">{{info.totalDeptNum || 0}}个</div>
                </div>
                <div class="row-item">
                    <div class="label">总申报次数</div>
                    <div class="val">{{info.totalApplyNum || 0}}个</div>
                </div>
            </div>
            <div class="chart-wrap">
                <div class="chart-title">新增单位趋势图</div>
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
            <div class="right-col">
                <div class="chart-wrap" style="width:100%;height:100%">
                    <div class="chart-title">单位申报次数占比</div>
                    
                    <div class="chart-container">
                        <div class="chart" id="chart2" ref="chart2"></div>

                    </div>
                </div>
            </div>
           <div class="right-col">
                <div class="chart-wrap" style="width:100%;height:100%">
                    <div class="chart-title">申报类别占比</div>
                    <div class="chart-container">
                        <div class="chart" id="chart3" ref="chart3"></div>

                    </div>
                </div>
           </div>
        </div>
    </div>
</template>
<script>
import { getDeptOverview,getDeptCreateStat,getDeptApplyPropStat } from "@/api/lampPost";
import * as echarts from 'echarts'

export default {
    data(){
        return {
            chart1:null,
            xAxis1:[],
            yAxis1:[],
            chart2:null,
            yAxis2:[],
            chart3:null,
            xAxis3:[],
            yAxis3:[],
            queryForm:{
                time:[],
                statType:'本月'
            },
            info:{
                currentMonthDeptIncrNum: 0,
                totalApplyNum: 8,
                totalDeptNum: 0
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
                        data: this.xAxis1
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
                            data: this.yAxis1,
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
                colors:['#F7C32D','#F1866D', '#61DEDD', '#6ADCAF', '#6395F9'],
                legend: {
                    top: 'bottom',
                    itemWidth:14,
                },
                
                series: [
                    {
                        name: 'Nightingale Chart',
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
        initChart3(){
            var el = this.$refs['chart3'];
            this.chart3 = echarts.init(el);

            let option = {
                colors:['#F7C32D','#F1866D', '#61DEDD', '#6ADCAF', '#6395F9'],
                legend: {
                    top: 'bottom',
                    itemWidth:14,
                },
                
                series: [
                    {
                        name: 'Nightingale Chart',
                        type: 'pie',
                        radius: [50, 120],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 0
                        },
                        data: this.yAxis3
                    }
                ]
            };

            this.chart3.setOption(option)

        },
        getDeptOverview(){
            getDeptOverview().then(res => {
                if (res.code == 200) {
                    if (res.data) {
                        this.$set(this, 'info', res.data)
                    }
                }
            })
        },
        getDeptCreateStat(){
             let params = {
                startTime:'',
                endTime:'',
                statType:''
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
            getDeptCreateStat(params).then(res => {
                 if (res.code == 200) {
                    if (res.data) {
                        let xAxis1 = [];
                        let yAxis1 = [];
                        res.data.forEach(item => {
                            xAxis1.push(item.timeStr)

                            yAxis1.push(item.value)
                        })

                        this.$set(this, 'xAxis1', xAxis1)
                        this.$set(this, 'yAxis1', yAxis1)

                        this.$nextTick(() => {
                            this.initChart1()
                        })
                    }
                 }
            })
        },
        getDeptApplyPropStat(){
             let params = {
                startTime:'',
                endTime:'',
                statType:''
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
            getDeptApplyPropStat(params).then(res => {
                if (res.code == 200) {
                    if (res.data) {
                        if (res.data.applyCountList) {
                            let yAxis2 = [];
                            res.data.applyCountList.forEach(item => {
                                yAxis2.push({
                                    value: item.times, name: item.name
                                })
                            })

                            this.$set(this, 'yAxis2', yAxis2)
                            this.$nextTick(() => {
                                this.initChart2()
                            })
                        }

                        if (res.data.applyTypeCountList) {
                            let yAxis3 = [];
                            res.data.applyCountList.forEach(item => {
                                yAxis3.push({
                                    value: item.times, name: item.name
                                })
                            })

                            this.$set(this, 'yAxis3', yAxis3)
                            this.$nextTick(() => {
                                this.initChart3()
                            })
                        }
                    }
                }
            })
        }
    },
    mounted(){
        this.getDeptOverview();
        this.getDeptCreateStat();
        this.getDeptApplyPropStat();
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
        
        margin-left: 24px;
        display: flex;
        flex-direction: column;

        .right-col{
            flex: 1;
            height: 0;
            width: 100%;
            border-radius: 4px;
            background-color: #fff;
        }

        .right-col + .right-col{
            margin-top: 24px;
        }
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
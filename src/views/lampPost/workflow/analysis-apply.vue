<template>
    <div class="app-container workflow-analysis-apply" style="background:#eee;height:calc(100vh - 50px)">
        <div class="left">
            <div class="row">
                <div class="row-item">
                    <div class="label">今日工单数</div>
                    <div class="val">{{info.todayCreateNum || 0}}件</div>
                </div>
                <div class="row-item">
                    <div class="label">总计工单数</div>
                    <div class="val">{{info.totalNum || 0}}件</div>
                </div>
                <div class="row-item">
                    <div class="label">完成率</div>
                    <div class="val">{{info.completePct || 0}}%</div>
                </div>
                <div class="row-item">
                    <div class="label">人均派单数</div>
                    <div class="val">{{info.workOrderNumPerPeople || 0}}件/人</div>
                </div>
            </div>
            <div class="chart-wrap">
                <div class="chart-title">工单统计柱状图</div>
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
                    <div class="chart-title">派单数排行</div>
                    <div class="chart-container">
                        <div class="chart" id="chart3" ref="chart3"></div>

                    </div>
                </div>
           </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'
import { getWorkOrderStatOverview,getWorkOrderCountStat } from "@/api/lampPost";

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
                todayCreateNum:'',
                totalNum:'',
                completePct:'',
                workOrderNumPerPeople:''
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
                    bottom:35,
                },
                series: [
                   {
                    type:'bar',
                    data:this.yAxis1,
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
                xAxis: {
                    axisLabel:{
                        formatter:'{value}'
                    } 
                },
                yAxis: {
                    type: 'category',
                    data: this.xAxis3,
                },
                grid:{
                    bottom:35,
                    left:70
                },
                series: [{
                    type: 'bar',
                    data: this.yAxis3,
                    label: {
                        show: true,
                        position: 'right',
                        valueAnimation: true,
                        formatter:'{@score}'
                    },
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                            { offset: 0, color: '#61DEDD' },
                            { offset: 1, color: 'rgba(97,222,221,0.05)' }
                        ])
                    },
                }],
                legend: {
                    show: true
                },
            };

            this.chart3.setOption(option)

        },
        getWorkOrderCountStat(){
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
            getWorkOrderCountStat(params).then(res => {
                if (res.code == 200) {
                    if (res.data) {
                        let xAxis1 = []
                        let yAxis1 = []

                        res.data.forEach(item => {
                            xAxis1.push(item.key)
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
        getWorkOrderStatOverview(){
            getWorkOrderStatOverview().then(res => {
                if (res.code == 200) {
                    this.info.todayCreateNum = res.data.todayCreateNum
                    this.info.totalNum = res.data.totalNum
                    this.info.completePct = res.data.completePct
                    this.info.workOrderNumPerPeople = res.data.workOrderNumPerPeople

                    if (res.data.deviceTypeWorkOrderList) {
                        let yAxis2 = []

                        res.data.deviceTypeWorkOrderList.forEach(item => {
                            yAxis2.push({
                                name:item.key,
                                value:item.value
                            })
                        })

                        this.$set(this, 'yAxis2', yAxis2)

                        this.$nextTick(() => {
                            this.initChart2()
                        })
                    }

                    if (res.data.deptWorkOrderList) {
                        let xAxis3 = []
                        let yAxis3 = []

                        res.data.deptWorkOrderList.forEach(item => {
                            xAxis3.push(item.key)
                            yAxis3.push(item.value)
                        })

                        this.$set(this, 'xAxis3', xAxis3)
                        this.$set(this, 'yAxis3', yAxis3)

                        this.$nextTick(() => {
                            this.initChart3()
                        })
                    }
                }
            })
        }
    },
    mounted(){
        this.getWorkOrderCountStat()
        this.getWorkOrderStatOverview();
    }
}
</script>
<style lang="scss">
.workflow-analysis-apply{
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